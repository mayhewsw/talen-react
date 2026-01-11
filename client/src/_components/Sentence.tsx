import React, { useState, useCallback } from "react";
import { Token } from "./Token";
import { Badge } from "react-bootstrap";

interface SentenceProps {
  index: number;
  sent: string[];
  labels: string[];
  default_labels: string[];
  space_markers: boolean[];
  labelset: { [key: string]: string };
  setFocus: (index: number) => void;
  isActive: boolean;
  set_label: (label: string, first: number, last: number) => void;
  isReadOnly: boolean;
  direction: string;
}

const Sentence: React.FC<SentenceProps> = ({
  index,
  sent,
  labels,
  default_labels,
  space_markers,
  labelset,
  setFocus,
  isActive,
  set_label,
  isReadOnly,
  direction,
}) => {
  const [selectedRange, setSelectedRange] = useState<[number, number]>([
    -1,
    -1,
  ]);

  const showPopoverFunc = useCallback(
    (tokenIndex: number): boolean => {
      return !isReadOnly && isActive && tokenIndex === selectedRange[1];
    },
    [isReadOnly, isActive, selectedRange]
  );

  const updateRange = useCallback((start: number, end: number) => {
    setSelectedRange([start, end]);
  }, []);

  const tokenUp = useCallback(
    (tokenIndex: number) => {
      updateRange(selectedRange[0], tokenIndex);
    },
    [selectedRange, updateRange]
  );

  const tokenDown = useCallback(
    (tokenIndex: number) => {
      updateRange(tokenIndex, tokenIndex);
    },
    [updateRange]
  );

  const checkClearRange = useCallback(
    (evt: React.MouseEvent) => {
      const tgt = evt.target as HTMLElement;
      if (
        tgt.classList.contains("token") ||
        tgt.classList.contains("label-button")
      ) {
        // do nothing - keep selection
      } else {
        updateRange(-1, -1);
      }
    },
    [updateRange]
  );

  const rowMouseDown = useCallback(() => {
    setFocus(index);
  }, [setFocus, index]);

  const rowMouseUp = useCallback(
    (evt: React.MouseEvent) => {
      if ((evt.target as HTMLElement).tagName !== "A") {
        checkClearRange(evt);
      }
    },
    [checkClearRange]
  );

  const selectedKeyword = useCallback(
    (i: number): string => {
      let first = selectedRange[0];
      let last = selectedRange[1];

      if (!isActive) {
        return "";
      }

      // If dragging backwards, swap them
      if (first > last) {
        const tmp = last;
        last = first;
        first = tmp;
      }

      if (first === last && first === i) {
        return "highlightsingle";
      }
      if (i === first) {
        return direction === "ltr" ? "highlightstart" : "highlightend";
      } else if (i === last) {
        return direction === "ltr" ? "highlightend" : "highlightstart";
      } else if (i > first && i < last) {
        return "highlighted";
      }

      return "";
    },
    [selectedRange, isActive, direction]
  );

  const highlightedPhrase = sent
    .slice(selectedRange[0], selectedRange[1] + 1)
    .join(" ");

  return (
    <div className="sentence" onMouseDown={rowMouseDown} onMouseUp={rowMouseUp}>
      <Badge className="sentence-badge" key={"badge-" + index} variant="light">
        {index}
      </Badge>
      <span dir={direction}>
        {sent.map((tok, tokenIndex) => (
          <Token
            key={tokenIndex}
            form={tok}
            space_after={space_markers[tokenIndex]}
            label={labels[tokenIndex]}
            default_label={default_labels[tokenIndex]}
            labelset={labelset}
            next_token_is_entity={
              tokenIndex === sent.length - 1
                ? false
                : labels[tokenIndex + 1][0] === "I"
            }
            next_token_is_default_entity={
              tokenIndex === sent.length - 1
                ? false
                : default_labels[tokenIndex + 1][0] === "I"
            }
            selected={selectedKeyword(tokenIndex)}
            mousedown={() => tokenDown(tokenIndex)}
            mouseup={() => tokenUp(tokenIndex)}
            show_popover={showPopoverFunc(tokenIndex)}
            display_phrase={highlightedPhrase}
            set_label={(label: string) =>
              set_label(label, selectedRange[0], selectedRange[1])
            }
          />
        ))}
      </span>
    </div>
  );
};

export default Sentence;
