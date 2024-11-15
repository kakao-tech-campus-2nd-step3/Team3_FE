// src/components/common/NumberButton/NumberButton.tsx
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledNumberButton = styled.button<{ clicked: boolean }>`
  width: 60px;
  height: 60px;
  background-color: ${({ clicked }) => (clicked ? "#39a7f7" : "#f0f4fa")};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ clicked }) => (clicked ? "#fff" : "#39a7f7")};
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #39a7f7;
    color: white;
  }

  ${breakpoints.tablet} {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
`;

interface Props {
  number: number;
  clicked: boolean;
  onClick: () => void;
}

const NumberButton = ({ number, clicked, onClick }: Props) => {
  return (
    <StyledNumberButton clicked={clicked} onClick={onClick}>
      {number}
    </StyledNumberButton>
  );
};

export default NumberButton;
