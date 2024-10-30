import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
// 슬라이드 애니메이션
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

// 전체 컨테이너
const PlanUpdateContainer = styled.div`
  display: grid;
  align-items: center;
  max-width: 1440px; 
  margin: 0 auto;
  margin-top: 20px;
`;

// 내용 래퍼
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

// 캘린더 컨테이너
const CalendarContainer = styled.div`
  width: 100%; 
`;

// 텍스트 스타일
const StyledText = styled.p`
  font-size: 23px;
  font-weight: bold;
  text-align: center;

  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
  ${breakpoints.mobile} {
    font-size: 16px;
    margin-top: 20px;
  }
`;

const StyledTextContainer = styled.div`
  height: 70px;
`;
// 버튼 섹션
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 130px; 
  margin-bottom: 30px;
`;

const PlanUpdate = () => {
  const TitleMessages = [
    "플랜을 수정하거나, 바로 저장하세요.",
    "일정을 옮기고 크기를 조정하여 원하는대로 플랜을 수정해보세요",
  ];

  // 메시지 애니메이션과 인덱스 상태
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 메시지와 애니메이션 설정
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  return (
    <PlanUpdateContainer>
      <ContentWrapper>
        <StyledTextContainer>
          <StyledText className={animate ? "animate" : ""}>
            {TitleMessages[currentMessageIndex]}
          </StyledText>
        </StyledTextContainer>

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
