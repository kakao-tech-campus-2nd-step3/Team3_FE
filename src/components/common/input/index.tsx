import React from "react";
import { StyledTextArea } from "./Input.styles";

export type Props = {
  size?: "large" | "medium" | "small" | "responsive";
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input: React.FC<Props> = ({ size = "responsive", ...props }) => {
  return <StyledTextArea size={size} {...props} />;
};

export default Input;
