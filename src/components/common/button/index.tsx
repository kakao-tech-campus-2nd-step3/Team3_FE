import React from "react";
import styled from "@emotion/styled";

export type Props = {
  theme?: "primary" | "secondary";
  size?: "large" | "medium" | "small" | "responsive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent: React.FC<Props> = ({
  theme = "primary",
  size = "medium",
  ...props
}) => {
  return <StyledButton theme={theme} size={size} {...props} />;
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
          height: "65px",
          fontSize: "32px",
        };
      case "small":
        return {
          height: "30px",
          fontSize: "14px",
        };
      case "responsive": {
        return {
          height: "30px",
          fontSize: "14px",
          "@media (min-width: 768px)": {
            //테블릿
            height: "50px",
            fontSize: "16px",
          },
          "@media (min-width: 1024px)": {
            //데스크탑
            height: "65px",
            fontSize: "20px",
          },
        };
      }
      default:
        return {
          height: "50px",
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

export default ButtonComponent;
