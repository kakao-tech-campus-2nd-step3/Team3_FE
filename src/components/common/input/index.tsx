import React from "react";
import styled from "@emotion/styled";

export type Props = {
  size?: "large" | "medium" | "small" | "responsive";
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input: React.FC<Props> = ({ size = "medium", ...props }) => {
  return <StyledTextArea size={size} {...props} />;
};

const StyledTextArea = styled.textarea<Pick<Props, "size">>(
  {
    borderRadius: "16px",
    padding: "10px",
    border: "3px solid #D5D5D5",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeight: 600,
    resize: "none",
    width: "calc(100% - 60px)",
    margin: "0 30px",
  },
  ({ size }) => {
    switch (size) {
      case "large":
        return {
          height: "392px",
          fontSize: "32px",
        };
      case "small":
        return {
          height: "187px",
          fontSize: "16px",
        };
      case "responsive":
        return {
          height: "187px",
          fontSize: "16px",
          "@media (min-width: 768px)": {
            height: "623px",
            fontSize: "26px",
          },
          "@media (min-width: 1280px)": {
            height: "392px",
            fontSize: "32px",
          },
        };
      default:
        return {
          height: "623px",
          fontSize: "26px",
        };
    }
  },
);

export default Input;
