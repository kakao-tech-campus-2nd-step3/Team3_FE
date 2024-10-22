import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
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

const PreviewPlanUpdateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  max-width: 320px;
  gap: 20px;
  margin: 0 auto;
  margin-top: 20px;
  ${breakpoints.desktop} {
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr 310px;
    max-width: 1440px;
  }
`;
const ContentWrapper = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const StyledText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-top: -20px;
  margin: 0px;
  text-align: center;
  margin-bottom: 20px;
  ${breakpoints.desktop} {
    font-size: 36px;
  }
  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
`;
const ButtonContainer = styled.div`
  grid-row: 3 / 4; /* 모바일에서는 세 번째로 버튼을 배치 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: flex-direction;
  gap: 20px;
  margin-top: -100px;
  ${breakpoints.desktop} {
    grid-column: 2 / 3; // 버튼이 사이드바와 같은 위치에 있도록 설정
    grid-row: 2 / 3;
    margin-top: -300px;
  }
`;

// 배열 선언
const PreviewPlanUpdate = () => {
  const TitleMessages = [
    "플랜을 수정하거나, 바로 저장하세요.",
    "일정을 옮기고 크기를 조정하여 원하는대로 플랜을 수정해보세요",
  ];

  // 인덱스, 애니메이션 선언
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 주기 선언
  useEffect(() => {
    const Interval = setInterval(() => {
      // 변수 인덱스 변경
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
      // 애니메이션 변경
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(Interval);
  }, []);

  const navigate = useNavigate();

  return (
    <PreviewPlanUpdateContainer>
      <ContentWrapper>
        <StyledText className={animate ? "animate" : " "}>
          {TitleMessages[currentMessageIndex]}
        </StyledText>
        <CustomCalendar />
        <ButtonContainer>
          <Button onClick={() => navigate(RouterPath.LOGIN)}>저장</Button>
          <Button theme="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </ButtonContainer>
      </ContentWrapper>
    </PreviewPlanUpdateContainer>
  );
};

export default PreviewPlanUpdate;
