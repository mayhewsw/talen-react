import React from "react";

interface ErrorViewProps {
  message?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message }) => {
  return message ? <div> {message} </div> : null;
};

export default ErrorView;
