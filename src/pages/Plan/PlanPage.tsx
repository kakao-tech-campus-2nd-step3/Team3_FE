import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/common/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";

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
const PlanPageContainer = styled.div`
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
  font-size: 20px;
  font-weight: bold;
  color: #938e8e;
  text-align: center;
  margin: 50px 0 0 0;
  ${breakpoints.tablet} {
    font-size: 36px;
  }
`;
const SubTitle = styled.p<{ animate: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;
  ${breakpoints.tablet} {
    font-size: 36px;
  }

  &.animate {
    animation: ${({ animate }) => (animate ? slideDown : "none")} 1s ease-in-out;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 130px;
  margin-bottom: 40px;
`;

// 고정된 부분들에 대해 memoization 적용
const MemoizedTitle = memo(() => {
  return <Title>마이크 버튼을 누르고 자세히 얘기해주세요.</Title>;
});

const MemoizedInput = memo(Input);
const MemoizedMicrophoneButton = memo(MicrophoneButton);
const MemoizedButton = memo(Button);
const MemoizedButtonContainer = memo(({ navigate }: { navigate: any }) => {
  return (
    <ButtonContainer>
      <MemoizedButton onClick={() => navigate(RouterPath.PLAN_SELECT)}>
        다음
      </MemoizedButton>
      <MemoizedButton
        onClick={() => navigate(-1)}
        theme="secondary"
        width="250px"
      >
        취소
      </MemoizedButton>
    </ButtonContainer>
  );
});

const PlanPage: React.FC = () => {
  const subTitleMessages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 타이머 실행
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === subTitleMessages.length - 1 ? 0 : prevIndex + 1,
      );

      // 에니메이션 시작
      setAnimate(true);

      // 애니메이션이 끝난 후 에니메이션 초기화
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // useNavigate 선언
  const navigate = useNavigate();

  return (
    <PlanPageContainer>
      <InputWrapper>
        <MemoizedTitle />
        <SubTitle animate={animate}>
          {subTitleMessages[currentMessageIndex]}
        </SubTitle>
        <MemoizedInput />
        <MemoizedMicrophoneButton />
        <MemoizedButtonContainer navigate={navigate} />
      </InputWrapper>
    </PlanPageContainer>
  );
};

export default PlanPage;
