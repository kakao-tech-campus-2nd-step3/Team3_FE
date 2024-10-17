import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/common/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  `;
const PreviewPlanPageContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;
const Title = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #938e8e;
  text-align: center;
  margin: 50px 0 0 0;
`;
const SubTitle = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;

  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 130px;
`;
const PreviewPlanPage: React.FC = () => {
  const subTitleMessages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 타이머 실행
  useEffect(() => {
    // 메세지 전환
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === subTitleMessages.length - 1 ? 0 : prevIndex + 1,
      );

      // 애니메이션 시작
      setAnimate(true);

      // 애니메이션이 끝난 후 에니메이션 초기화
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PreviewPlanPageContainer>
      <InputWrapper>
        <Title>마이크 버튼을 누르고 자세히 얘기해주세요.</Title>
        <SubTitle className={animate ? "animate" : ""}>
          {subTitleMessages[currentMessageIndex]}
        </SubTitle>
        <Input />
        <MicrophoneButton />
        <ButtonContainer>
          <Button width="250px">다음</Button>
          <Button theme="secondary" width="250px">
            취소
          </Button>
        </ButtonContainer>
      </InputWrapper>
    </PreviewPlanPageContainer>
  );
};

export default PreviewPlanPage;
