import React from "react";
import { StyledTextArea } from "./Input.styles";

export type Props = {} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input: React.FC<Props> = (props) => {
  return <StyledTextArea {...props} />;
};

export default Input;