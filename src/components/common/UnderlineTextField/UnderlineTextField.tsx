import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

type Props = {
  invalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = styled.input<Pick<Props, "invalid">>(
  {
    width: "100%",
    boxSizing: "border-box",
    color: "#191919",
    transition: "border-color 200ms",
    borderStyle: "solid",

    "&:focus": {
      outline: "none",
      borderColor: "#252525",
    },
    "&:disabled": {
      color: "#7d7d7d",
      cursor: "not-allowed",
    },

    "&::placeholder": {
      color: "#7d7d7d",
    },
  },
  () => ({
    minHeight: "42px",
    fontSize: "15px",
    lineHeight: "1.5",
    padding: "9px 0",
    borderWidth: "0 0 1px",

    [`@media screen and (min-width:${breakpoints.sm})`]: {
      minHeight: "46px",
      fontSize: "18px",
      lineHeight: "25px",
      padding: "10px 0 8px",
      borderWidth: "0 0 2px",
    },
  }),
  ({ invalid = false }) => ({
    borderColor: invalid ? "#ff4b4b" : "#ccc",
  }),
);

const UnderlineTextField = (props: Props) => <Input {...props} />;

export default UnderlineTextField;
