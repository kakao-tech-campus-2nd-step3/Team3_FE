import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledInput = styled.input(
  {
    borderRadius: "16px",
    padding: "10px",
    border: "3px solid #D5D5D5",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight: "600",
    width: "80%",
    resize: "none",
    margin: "0 30px",
  },
  {
    height: "250px",
    fontSize: "16px",
    [breakpoints.tablet]: {
      fontSize: "26px",
    },
    [breakpoints.desktop]: {
      fontSize: "32px",
    },
  },
);

export default StyledInput;
