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

const PlanUpdateContainer = styled.div`
  display: grid;
  align-items: center;
  max-width: 320px;
  margin: 0 auto;
  margin-top: 20px;
  ${breakpoints.desktop} {
    max-width: 1440px;
  }
`;
const ContentWrapper = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const CalendarContainer = styled.div`
  margin-top: 20px;
`;

const StyledText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-top: -20px;
  margin: 0px;
  text-align: center;
  ${breakpoints.desktop} {
    font-size: 36px;
  }

  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: flex-direction;
  gap: 20px;
  margin-top: -100px;
  ${breakpoints.desktop} {
    margin-top: 0px;
    gap: 130px;
  }
`;

// 배열 선언
const PlanUpdate = () => {
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
    <PlanUpdateContainer>
      <ContentWrapper>
        <StyledText className={animate ? "animate" : " "}>
          {TitleMessages[currentMessageIndex]}
        </StyledText>
        <CalendarContainer>
          <CustomCalendar />
        </CalendarContainer>
        <ButtonContainer>
          <Button onClick={() => navigate(RouterPath.MAIN)}>저장</Button>
          <Button theme="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </ButtonContainer>
      </ContentWrapper>
    </PlanUpdateContainer>
  );
};

export default PlanUpdate;
