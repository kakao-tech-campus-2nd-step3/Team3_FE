import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledNumberButton = styled.button<{ clicked: boolean }>`
  width: 50px;
  height: 50px;
  background-color: ${({ clicked }) => (clicked ? "#39a7f7" : "#fff")};
  border: 2px solid #39a7f7;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: ${({ clicked }) => (clicked ? "#fff" : "#39a7f7")};
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #39a7f7;
    border: none;
    color: white;
  }

  ${breakpoints.desktop} {
    width: 70px;
    height: 70px;
    font-size: 20px;
    border-radius: 16px;
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
