import styled from "@emotion/styled";
import { ButtonHTMLAttributes } from "react";

// CircleButton의 타입 정의
interface CircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
  color?: string;
  fontSize?: string;
  hoverColor?: string;
}

const StyledCircleButton = styled.button<CircleButtonProps>`
  width: ${({ size }) => size || "50px"};
  height: ${({ size }) => size || "50px"};
  border-radius: 50%;
  background-color: ${({ color }) => color || "#39A7F7"};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ fontSize }) => fontSize || "16px"};

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#8FD0FF"};
  }
`;

const CircleButton = ({ ...props }) => {
  return <StyledCircleButton {...props}>{props.children}</StyledCircleButton>;
};

export default CircleButton;
