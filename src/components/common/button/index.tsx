import React from "react";
import { StyledButton } from "./Button.styles";

export type Props = {
  theme?: "primary" | "secondary";
  size?: "large" | "medium" | "small" | "responsive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({
  theme = "primary",
  size = "responsive",
  children,
  ...props
}) => {
  return (
    <StyledButton theme={theme} size={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
