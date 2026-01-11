import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface IMyProps {
  show: boolean;
}

const LoginModal: React.FC<IMyProps> = (props: IMyProps) => {
  const [registering, setRegistering] = useState(false);

  const toggleRegistering = () => {
    setRegistering(!registering);
  };

  const showHideClassName = props.show
    ? "mymodal display-block"
    : "mymodal display-none";

  return (
    <div className={showHideClassName}>
      <div className="mymodal-main">
        {registering ? (
          <RegisterForm onToggleRegister={toggleRegistering} />
        ) : (
          <LoginForm onToggleRegister={toggleRegistering} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
