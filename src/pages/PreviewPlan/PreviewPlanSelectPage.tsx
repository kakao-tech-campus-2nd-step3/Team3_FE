import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import {
  useGptLight,
  useGptModerate,
  useGptStrong,
  GptRequestData,
} from "@/api/hooks/useGptTrialRequest";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import { useDeviceId } from "@/contexts/DeviceIdContext";

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

type GptLevel = "light" | "moderate" | "strong";

const PreviewPlanSelectPage = () => {
  const { data: plans } = useGetPlans();

  // 선택된 버튼 번호를 저장할 상태
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const navigate = useNavigate();
  const { deviceId } = useDeviceId();
  const location = useLocation();
  const speechText = location.state?.speechText || "";

  // GPT 요청 훅들을 초기화
  const lightMutation = useGptLight();
  const moderateMutation = useGptModerate();
  const strongMutation = useGptStrong();

  // 번호별 GPT 레벨 매핑
  const levelMap: Record<number, GptLevel> = {
    1: "light",
    2: "moderate",
    3: "strong",
  };

  // GPT 요청을 처리하는 함수
  const handleGptRequest = async (number: number) => {
    if (!deviceId) {
      console.error("DeviceId not avaliable");
      return;
    }

    const requestData: GptRequestData = {
      deviceId,
      text: speechText || "plan generation request",
    };

    try {
      const level = levelMap[number];
      let response;
      switch (level) {
        case "light":
          response = await lightMutation.mutateAsync(requestData);
          console.log("Light plan response:", response);
          break;
        case "moderate":
          response = await moderateMutation.mutateAsync(requestData);
          console.log("Moderate plan response:", response);
          break;
        case "strong":
          response = await strongMutation.mutateAsync(requestData);
          console.log("Strong plan response:", response);
          break;
        default:
      }
    } catch (error) {
      console.error("Error in GPT request", error);
    }
  };

  const handleNumberButtonClick = async (number: number) => {
    setClickedNumber(number);
    await handleGptRequest(number);
  };

  const handleConfirmClick = () => {
    if (clickedNumber) {
      navigate(RouterPath.PREVIEW_PLAN_UPDATE);
    }
  };

  // 로딩 상태 확인
  const isLoading =
    lightMutation.isPending ||
    moderateMutation.isPending ||
    strongMutation.isPending;

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
        <CustomCalendar plans={plans || []} />
      </CalendarSection>

      <ButtonContainer>
        <Button
          size="responsive"
          onClick={handleConfirmClick}
          disabled={!clickedNumber || isLoading}
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
