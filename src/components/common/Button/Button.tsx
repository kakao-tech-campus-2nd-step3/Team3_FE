// Button.tsx
import React from "react";
import StyledButton from "./Button.styles";
import { Props } from "./Button.types";

const Button: React.FC<Props> = ({
  theme = "primary",
  size = "responsive", // 기본값 responsive
  onClick,
  disabled,
  type,
  children,
}) => {
  return (
    <StyledButton
      theme={theme}
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
