import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";
import { Props } from "./Button.types";

const StyledButton = styled.button<Pick<Props, "theme">>(
  {
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 200ms",
    padding: "0 16px",
    width: "100%",
    fontWeight: "bold",
    outline: "none", // 클릭 시 포커스 테두리 제거
    "&:focus": {
      outline: "none", // 추가로 focus 상태에서도 테두리 제거
    },
  },
  {
    height: "40px",
    fontSize: "14px",
    [breakpoints.tablet]: {
      // 테블릿
      height: "48px",
      fontSize: "16px",
    },
    [breakpoints.desktop]: {
      // 데스크탑
      height: "50px",
      fontSize: "15px",
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
