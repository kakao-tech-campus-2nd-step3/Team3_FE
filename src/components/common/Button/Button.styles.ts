// Button.styles.ts
import styled from "@emotion/styled";
import breakpoints from "@/variants/variants";
import { Props } from "./Button.types";

const StyledButton = styled.button<Pick<Props, "theme" | "size">>(
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
  ({ size = "responsive" }) => {
    const smallStyle = {
      width: "80px",
      height: "40px",
      fontSize: "14px",
    };

    const largeStyle = {
      width: "150px",
      height: "50px",
      fontSize: "20px",
    };

    const longStyle = {
      width: "170px",
      height: "40px",
      fontSize: "15px",
    };

    if (size === "small") {
      return smallStyle;
    }

    if (size === "large") {
      return largeStyle;
    }

    if (size === "long") {
      return longStyle;
    }

    // 반응형
    return {
      ...smallStyle,
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
    };
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

export default StyledButton;
