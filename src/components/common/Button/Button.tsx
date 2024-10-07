import React from "react";
import styled from "@emotion/styled";
import breakpoints from "@/variants/variants";
import { Props } from "./Button.types";

const StyledButton = styled.button<Pick<Props, "theme">>(
  {
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 200ms",
    padding: "0 16px",
    outline: "none",
    "&:focus": {
      outline: "none",
    },
  },
  {
    width: "80px",
    height: "40px",
    fontSize: "14px",
    [breakpoints.tablet]: {
      width: "120px",
      height: "48px",
      fontSize: "16px",
    },
    [breakpoints.desktop]: {
      width: "150px",
      height: "50px",
      fontSize: "20px",
    },
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
          },
        };
      default:
        return {};
    }
  },
);

const Button: React.FC<Props> = ({ theme = "primary", children, ...props }) => {
  return (
    <StyledButton theme={theme} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
