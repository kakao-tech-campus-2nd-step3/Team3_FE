import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

const StyledNumberButton = styled.button`
  width: 50px;
  height: 50px;
  background-color: #fff;
  border: 2px solid #39a7f7;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #39a7f7;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #39a7f7;
    border: none;
    color: white;
  }

  //반응형 미디어 쿼리 추가
  ${breakpoints.tablet} {
    width: 60px;
    height: 60px;
    font-size: 20px;
    font-size: 20px;
    border-radius: 16px;
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
}

const NumberButton = ({ number }: Props) => {
  return <StyledNumberButton>{number}</StyledNumberButton>;
};

export default NumberButton;
