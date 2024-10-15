import React from "react";
import StyledButton from "./Button.styles";
import { Props } from "./Button.types";

const Button: React.FC<Props> = ({
  theme = "primary",
  onClick,
  disabled,
  type,
  children,
}) => {
  return (
    <StyledButton
      theme={theme}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
