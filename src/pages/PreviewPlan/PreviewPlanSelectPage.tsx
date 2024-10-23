import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";

const PreviewPlanSelectPageContainer = styled.div`
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
const CalendarSection = styled.div`
  grid-row: 2/3;
  padding: -10px;
  ${breakpoints.desktop} {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    padding: 40px;
  }
`;
const SidebarSection = styled.div`
  grid-row: 1 / 2;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 0 auto;
  ${breakpoints.desktop} {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    width: 310px;
`;

const StyledText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-top: -20px;
  margin: 0px;
  ${breakpoints.desktop} {
    font-size: 36px;
  }
`;

const NumberButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  ${breakpoints.desktop} {
    margin-bottom: 400px; /* 데스크탑에서는 더 넓은 하단 여백 */
  }
`;
const ButtonContainer = styled.div`
  grid-row: 3 / 4; /* 모바일에서는 세 번째로 버튼을 배치 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: flex-direction;
  gap: 20px;
  margin-top: -200px;
  ${breakpoints.desktop} {
    grid-column: 2 / 3; // 버튼이 사이드바와 같은 위치에 있도록 설정
    grid-row: 2 / 3;
    margin-top: -300px;
  }
`;

const PlanSelectPage = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    window.innerWidth >= 1280,
  );

  const updateMedia = () => {
    setIsDesktop(window.innerWidth >= 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  // 선택된 버튼 번호를 저장할 상태
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleNumberButtonClick = (number: number) => {
    setClickedNumber(number);
  };

  return (
    <PreviewPlanSelectPageContainer>
      <CalendarSection>
        <CustomCalendar />
      </CalendarSection>
      <SidebarSection>
        <StyledText>
          원하는 플랜을 {isDesktop && <br />}
          선택하세요.
        </StyledText>
        <NumberButtonContainer>
          <NumberButton
            number={1}
            clicked={clickedNumber === 1}
            onClick={() => handleNumberButtonClick(1)}
          />
          <NumberButton
            number={2}
            clicked={clickedNumber === 2}
            onClick={() => handleNumberButtonClick(2)}
          />
          <NumberButton
            number={3}
            clicked={clickedNumber === 3}
            onClick={() => handleNumberButtonClick(3)}
          />
        </NumberButtonContainer>
      </SidebarSection>
      <ButtonContainer>
        <Button onClick={() => navigate(RouterPath.PREVIEW_PLAN_UPDATE)}>
          확인
        </Button>
        <Button theme="secondary" onClick={() => navigate(-1)}>
          취소
        </Button>
      </ButtonContainer>
    </PreviewPlanSelectPageContainer>
  );
};

export default PlanSelectPage;
