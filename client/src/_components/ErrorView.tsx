import React from "react";

const ErrorView = (props: any) => {
  return props.message ? <div> {props.message} </div> : null;
};

export default ErrorView;
