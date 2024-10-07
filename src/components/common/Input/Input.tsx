import React from "react";
import StyledInput from "./Input.styles";

export type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;
