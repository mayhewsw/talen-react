import React from "react";
import { LoginForm } from "./LoginForm";

interface IMyProps {
  show: boolean;
  handleClick: any;
}

const LoginModal: React.FC<IMyProps> = (props: IMyProps) => {
  const showHideClassName = props.show
    ? "mymodal display-block"
    : "mymodal display-none";
  return (
    <div className={showHideClassName}>
      <div className="mymodal-main">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginModal;
