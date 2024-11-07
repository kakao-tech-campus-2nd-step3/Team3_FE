// Button.styles.ts
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";
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
      width: "100px",
      height: "40px",
      fontSize: "14px",
    };

    const largeStyle = {
      width: "150px",
      height: "50px",
      fontSize: "20px",
    };

    const longStyle = {
      width: "160px",
      height: "45px",
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
      [breakpoints.mobile]: {
        width: "100px",
        height: "40px",
        fontSize: "14px",
      },
      width: "150px",
      height: "50px",
      fontSize: "20px",
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
      case "kakao":
        return {
          backgroundColor: "#ffe401",
          color: "#1e1e1f",
          border: "none",
          "&:hover": {
            backgroundColor: "#ffcd00",
            color: "#1a1a1a",
            transition: "all 0.3s ease",
          },
        };
      default:
        return {};
    }
  },
);

export default StyledButton;
