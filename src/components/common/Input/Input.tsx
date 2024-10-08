import React from "react";
import StyledTextArea from "./Input.styles";

export type Props = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ onChange, value, placeholder, disabled }) => {
  return (
    <StyledTextArea
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Input;
