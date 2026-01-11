import React from "react";

interface LoadingViewProps {
  currentlySending: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({ currentlySending }) => {
  return currentlySending ? <div> Loading... </div> : null;
};

export default LoadingView;
