import React from "react";
import StyledInput from "./Input.styles";

export type Props = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ onChange, value, placeholder, disabled }) => {
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
