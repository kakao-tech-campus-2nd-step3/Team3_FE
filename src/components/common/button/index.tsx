import React from "react";
import styled from "@emotion/styled";

export type Props = {
  theme?: "primary" | "secondary";
  size?: "large" | "medium" | "small" | "responsive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({
  theme = "primary",
  size = "medium",
  children,
  ...props
}) => {
  return (
    <StyledButton theme={theme} size={size} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<Pick<Props, "theme" | "size">>(
  {
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 200ms",
    padding: "0 16px",
  },
  ({ size }) => {
    switch (size) {
      case "large":
        return {
          width: "150px",
          height: "50px",
          fontSize: "20px",
        };
      case "small":
        return {
          width: "80px",
          height: "40px",
          fontSize: "14px",
        };
      case "responsive": {
        return {
          width: "80px",
          height: "40px",
          fontSize: "14px",
          "@media (min-width: 768px)": {
            //테블릿
            width: "120px",
            height: "48px",
            fontSize: "16px",
          },
          "@media (min-width: 1280px)": {
            //데스크탑
            width: "150px",
            height: "50px",
            fontSize: "20px",
          },
        };
      }
      default:
        return {
          width: "120px",
          height: "48px",
          fontSize: "16px",
        };
    }
  },
  ({ theme }) => {
    switch (theme) {
      case "primary":
        return {
          backgroundColor: "#39A7F7",
          color: "white",
          border: "none",
          "&:hover": {
            backgroundColor: "#8FD0FF",
            color: "black",
            border: "none",
          },
        };
      case "secondary":
        return {
          backgroundColor: "#ffffff",
          color: "#39A7F7",
          border: "1px solid #39A7F7",
          "&:hover": {
            backgroundColor: "#DCDCDC",
            color: "black",
            border: "1px solid #39A7F7",
          },
        };
      default:
        return {};
    }
  },
);

export default Button;
