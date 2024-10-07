import React from "react";
import StyledButton from "./Button.styles";

export type Props = {
  theme?: "primary" | "secondary";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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
