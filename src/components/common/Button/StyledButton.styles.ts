import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";
import { Props } from "./Button.types";

const StyledButton = styled.button<Pick<Props, "theme" | "width">>(
  ({ width }) => ({
    width: width || "100%", // 전달받은 width 값을 사용하고, 기본값은 100%로 설정
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 200ms",
    padding: "0 16px",
    fontWeight: "bold",
    outline: "none",
    "&:focus": {
      outline: "none",
    },
  }),

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
          width: "100px",
          height: "40px",
          fontSize: "14px",
          [breakpoints.tablet]: {
            width: "187px",
            height: "48px",
            fontSize: "16px",
          },
          [breakpoints.desktop]: {
            width: "200px",
            height: "50px",
            fontSize: "15px",
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
          width: "100px",
          height: "40px",
          fontSize: "14px",
          [breakpoints.tablet]: {
            height: "48px",
            fontSize: "16px",
            width: "187px", // 테블릿에서 너비 187px
          },
          [breakpoints.desktop]: {
            height: "50px",
            fontSize: "15px",
            width: "200px", // 데스크탑에서 너비 200px
          },
        };
      default:
        return {
          height: "50px",
          fontSize: "16px",
          backgroundColor: "#fee500",
          color: "black",
          border: "none",
          "&:hover": {
            backgroundColor: "#fada0a",
          },
        };
    }
  },
);

export default StyledButton;
