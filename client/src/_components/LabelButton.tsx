import React from "react";
import { Button } from "react-bootstrap";

interface LabelButtonProps {
  label: string;
  onClick: () => void;
  color: string;
}

const LabelButton: React.FC<LabelButtonProps> = ({ label, onClick, color }) => {
  return (
    <Button
      onClick={onClick}
      bsPrefix="custom-btn"
      className={["label-button", label].join(" ")}
      style={{ background: color }}
    >
      {label}
    </Button>
  );
};

export default LabelButton;
