import React from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface IMyProps {
  show: boolean;
  registering: boolean;
}

const LoginModal: React.FC<IMyProps> = (props: IMyProps) => {
  const showHideClassName = props.show
    ? "mymodal display-block"
    : "mymodal display-none";
  return (
    <div className={showHideClassName}>
      <div className="mymodal-main">
        {props.registering ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default LoginModal;
