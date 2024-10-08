import React from "react";
import { StyledButton } from "./Button.styles";

export type Props = {
  theme?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({ theme = "primary", children, ...props }) => {
  return (
    <StyledButton theme={theme} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
