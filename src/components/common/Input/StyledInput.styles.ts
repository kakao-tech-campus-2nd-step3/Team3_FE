import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledInput = styled.input(
  {
    borderRadius: "16px",
    padding: "10px",
    border: "3px solid #D5D5D5",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight: 600,
    resize: "none",
    margin: "0 30px",
  },
  {
    width: "348px",
    height: "187px",
    fontSize: "16px",
    [breakpoints.desktop]: {
      width: "955px",
      height: "392px",
      fontSize: "32px",
    },
  },
);

export default StyledInput;
