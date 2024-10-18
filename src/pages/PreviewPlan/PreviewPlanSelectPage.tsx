import styled from "@emotion/styled";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";

const PreviewPlanSelectPageContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr 310px;
  width: 1440px;
  gap: 20px;
  margin: 0 auto;
`;
const CalendarSection = styled.div`
  padding: 20px;
`;
const SidebarSection = styled.div`
  width: 310px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
  margin: 0 auto;
`;

const StyledText = styled.p`
  font-size: 36px;
  font-weight: bold;
`;

const NumberButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 400px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  margin-top: -140px;
`;

const PreviewPlanSelectPage = () => {
  return (
    <PreviewPlanSelectPageContainer>
      <CalendarSection>
        <CustomCalendar />
      </CalendarSection>
      <SidebarSection>
        <StyledText>
          원하는 플랜을 <br />
          선택하세요.
        </StyledText>
        <NumberButtonContainer>
          <NumberButton number={1} />
          <NumberButton number={2} />
          <NumberButton number={3} />
        </NumberButtonContainer>
        <ButtonContainer>
          <Button>확인</Button>
          <Button theme="secondary">취소</Button>
        </ButtonContainer>
      </SidebarSection>
    </PreviewPlanSelectPageContainer>
  );
};

export default PreviewPlanSelectPage;
