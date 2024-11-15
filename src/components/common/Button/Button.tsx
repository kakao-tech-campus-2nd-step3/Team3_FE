// src/components/common/Button/Button.tsx
import React from "react";
import StyledButton from "./StyledButton.styles";
import { Props } from "./Button.types";

const Button: React.FC<Props> = ({
  theme = "primary",
  size = "responsive",
  onClick,
  disabled,
  type,
  children,
  ...props
}) => {
  return (
    <StyledButton
      theme={theme}
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
