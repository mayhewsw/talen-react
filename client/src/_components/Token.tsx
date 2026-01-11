import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Popover, Overlay } from "react-bootstrap";
import LabelButton from "./LabelButton";
import { connect } from "react-redux";

interface TokenProps {
  wordsColor: string;
  form: string;
  space_after: boolean;
  label: string;
  default_label: string;
  labelset: { [key: string]: string };
  selected: string;
  mousedown: () => void;
  mouseup: () => void;
  show_popover: boolean;
  set_label: (label: string) => void;
  next_token_is_entity: boolean;
  next_token_is_default_entity: boolean;
  display_phrase: string;
}

const Token: React.FC<TokenProps> = ({
  wordsColor,
  form,
  space_after,
  label,
  default_label,
  labelset,
  selected,
  mousedown,
  mouseup,
  show_popover,
  set_label,
  next_token_is_entity,
  next_token_is_default_entity,
  display_phrase,
}) => {
  const myRef = useRef<HTMLSpanElement>(null);

  const handleContextMenu = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleContextMenu]);

  const handleOver = useCallback(
    (evt: React.MouseEvent<HTMLSpanElement>) => {
      // if the left button is pressed
      if (evt.buttons === 1) {
        mouseup();
      }
    },
    [mouseup]
  );

  const handleDown = useCallback(
    (evt: React.MouseEvent<HTMLSpanElement>) => {
      if (evt.button === 2) {
        // don't allow right click to open a menu
        return;
      }

      // only fire if you click on a token.
      if ((evt.target as HTMLElement).classList.contains("token")) {
        mousedown();
      }
    },
    [mousedown]
  );

  const handleUp = useCallback(
    (evt: React.MouseEvent<HTMLSpanElement>) => {
      if (evt.button === 2) {
        // right click - clear label
        set_label("O");
        return;
      }

      mouseup();
    },
    [mouseup, set_label]
  );

  const tag = label.split("-").pop() || "O";
  const default_tag = default_label.split("-").pop() || "O";

  // Decide if we are going to show the main or default label
  // The default label is a starter: perhaps from an ML system
  const display_default = tag === "O" && default_tag !== "O";

  const tag_class = display_default ? default_tag : tag;
  // The 44 at the end is transparency in the RGBA space.
  const background = labelset[tag_class] + (display_default ? "44" : "");
  const default_background = labelset[default_tag] + "44";

  const labellist = useMemo(() => {
    const list = Object.keys(labelset).sort();
    const oindex = list.indexOf("O");
    if (oindex !== -1) {
      list.splice(oindex, 1);
      list.push("O");
    }
    return list;
  }, [labelset]);

  const label_button_list = useMemo(
    () =>
      labellist.map((labelName) => (
        <LabelButton
          key={labelName}
          label={labelName}
          color={labelset[labelName]}
          onClick={() => set_label(labelName)}
        />
      )),
    [labellist, labelset, set_label]
  );

  const spacer_list = ["spacer", "nocopy"];
  const spacer_style: React.CSSProperties = { background: "transparent" };

  // it's important that this block (default) come before the other one.
  if (default_label !== "O" && next_token_is_default_entity) {
    spacer_style.background = default_background;
    spacer_list.push("label");
  }

  if (label !== "O" && next_token_is_entity) {
    spacer_style.background = background;
    spacer_list.push("label");
  }

  if (selected === "highlightstart" || selected === "highlighted") {
    spacer_list.push("highlighted");
  }

  const class_list = [
    "token",
    "nocopy",
    selected,
    tag_class,
    display_default ? "default-label" : "label",
  ];

  if (display_default) {
    if (!next_token_is_default_entity && default_label[0] === "B") {
      class_list.push("labelsingle");
    } else if (default_label[0] === "B") {
      class_list.push("labelstart");
    } else if (default_label !== "O" && !next_token_is_default_entity) {
      class_list.push("labelend");
    }
  } else {
    if (!next_token_is_entity && label[0] === "B") {
      class_list.push("labelsingle");
    } else if (label[0] === "B") {
      class_list.push("labelstart");
    } else if (label !== "O" && !next_token_is_entity) {
      class_list.push("labelend");
    }
  }

  return (
    <>
      <span
        className={class_list.join(" ")}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        onMouseOver={handleOver}
        style={{
          background: background,
          color: wordsColor,
        }}
        ref={myRef}
      >
        {form}
      </span>
      {/*  this whitespace is needed to get correct line breaks! */}
      {space_after && (
        <span className={spacer_list.join(" ")} style={spacer_style}>
          {" "}
        </span>
      )}
      <Overlay
        show={show_popover}
        target={myRef.current}
        placement={"bottom"}
        transition={false}
      >
        <Popover id="popover-container">
          <Popover.Title>
            {display_phrase}{" "}
            <a
              href={`https://www.google.com/search?q=${display_phrase}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (Google)
            </a>
          </Popover.Title>
          <Popover.Content>
            <div className="label-box">{label_button_list}</div>
          </Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
};

interface ReduxState {
  data: {
    wordsColor: string;
  };
}

function mapState(state: ReduxState) {
  const { data } = state;
  const { wordsColor } = data;
  return { wordsColor };
}

const actionCreators = {};

const connectedToken = connect(mapState, actionCreators)(Token);
export { connectedToken as Token };
