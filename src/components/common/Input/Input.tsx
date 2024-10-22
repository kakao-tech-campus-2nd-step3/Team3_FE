import React from "react";
import StyledInput from "./Input.styles";

export type Props = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ value, placeholder, disabled, onChange }) => {
  return (
    <StyledInput
    onChange={onChange}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Input;
