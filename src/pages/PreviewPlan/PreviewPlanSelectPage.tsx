import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useGetPlanCard from "@/api/hooks/useGetPlanCard";
import useGenerateDeviceId from "@/api/hooks/useGenerateDeviceId";

const PreviewPlanSelectPageContainer = styled.div`
  display: grid;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
`;

const CalendarSection = styled.div`
  margin-bottom: 40px;
  ${breakpoints.mobile} {
    margin-bottom: -50px;
  }
`;

const SidebarSection = styled.div`
  font-size: 30px;
  font-weight: bold;
  ${breakpoints.mobile} {
    font-size: 18px;
  }
`;

const StyledText = styled.p`
  text-align: center;
`;

const NumberButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 130px;
  margin-bottom: 30px;
  ${breakpoints.mobile} {
    gap: 30px;
  }
`;

const PreviewPlanSelectPage = () => {
  const { data: deviceId } = useGenerateDeviceId();
  const { data: plans } = useGetPlanCard(deviceId);

  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleNumberButtonClick = (number: number) => {
    setClickedNumber(number);
  };

  // 선택된 플랜 그룹의 이벤트 변환
  const selectedPlanGroup = plans?.find(
    (plan) => plan.groupId === String(clickedNumber),
  );

  const calendarEvents: CalendarEvent[] = selectedPlanGroup
    ? selectedPlanGroup.planCards.map((planCard) => ({
        id: planCard.cardId,
        title: planCard.title,
        description: planCard.description,
        start: new Date(planCard.startTimestamp * 1000),
        end: new Date(planCard.endTimestamp * 1000),
        accessibility: true, // 기본값 설정
        complete: false, // 기본값 설정
      }))
    : [];

  return (
    <PreviewPlanSelectPageContainer>
      <SidebarSection>
        <StyledText>원하는 플랜을 선택하세요.</StyledText>
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

      <CalendarSection>
        <CustomCalendar
          plans={calendarEvents}
          isPreviewMode
          previewDeviceId={deviceId}
          previewGroupId={selectedPlanGroup?.groupId}
        />
      </CalendarSection>

      <ButtonContainer>
        <Button
          size="responsive"
          onClick={() =>
            navigate(RouterPath.PREVIEW_PLAN_UPDATE, {
              state: {
                selectedPlan: calendarEvents,
                deviceId, // 실제 deviceId 값
                groupId: selectedPlanGroup?.groupId, // 선택된 그룹의 groupId },
              },
            })
          }
        >
          확인
        </Button>
        <Button
          size="responsive"
          theme="secondary"
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
      </ButtonContainer>
    </PreviewPlanSelectPageContainer>
  );
};

export default PreviewPlanSelectPage;
