import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGptRequest from "@/api/hooks/useGptRequest";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/features/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useVoiceHook from "@/hooks/useVoiceHook";
import useGenerateDeviceId from "@/api/hooks/useGenerateDeviceId";
import useSavePlan from "@/api/hooks/useSavePlan";

const PlanPageContainer = styled.div`
  width: 60%
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
  width: 100%;
`;
const Title = styled.p`
  font-size: 30px;
  font-weight: bold;
  color: #938e8e;
  text-align: center;
  margin: 50px 0 0 0;
  ${breakpoints.tablet} {
    font-size: 20px;
  }
`;
const SubTitle = styled.p`
  font-size: 30px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;
  ${breakpoints.tablet} {
    font-size: 18px;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 130px;
  margin-bottom: 40px;
`;

function MessageSilderWithAnimation() {
  const messages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 타이머 실행
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <SubTitle>{messages[currentMessageIndex]}</SubTitle>;
}

const PlanPage: React.FC = () => {
  const {
    transcript,
    setTranscript,
    isRecording,
    handleStartRecording,
    handleStopRecording,
  } = useVoiceHook();
  const navigate = useNavigate();
  const { data: deviceId } = useGenerateDeviceId();
  const useGptRequesetMutation = useGptRequest();
  const savePlanMutation = useSavePlan();

  const handleNextClick = async () => {
    if (!deviceId) {
      alert("Device ID를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      // 1. GPT 요청 보내기
      const gptResponse = await useGptRequesetMutation.mutateAsync({
        deviceId,
        text: transcript,
      });

      console.log("GPT 응답 데이터:", gptResponse);

      // gptResponse의 구조에 따라 data에서 필요한 데이터 추출
      const { groupId, planCards } = gptResponse[0] || {};

      // 데이터 유효성 검사
      if (!groupId || !Array.isArray(planCards) || planCards.length === 0) {
        throw new Error(
          "응답 데이터가 올바르지 않습니다. groupId와 planCards를 확인해 주세요.",
        );
      }

      // planCards 배열의 각 카드가 필요한 필드를 포함하는지 확인
      const formattedPlanCards = planCards.map((card) => ({
        title: card.title || "기본 제목",
        description: card.description || "기본 설명",
        startDate: card.startDate || new Date().toISOString(),
        endDate:
          card.endDate ||
          new Date(new Date().getTime() + 3600 * 1000).toISOString(),
        accessibility: card.accessibility ?? true,
        isCompleted: card.isCompleted ?? false,
      }));

      console.log("플랜 저장 요청 데이터:", {
        deviceId,
        groupId,
        planCards: formattedPlanCards,
      });

      // 2. GPT 응답을 사용하여 플랜 저장 요청 보내기
      await savePlanMutation.mutateAsync({
        deviceId,
        groupId,
        planCards: formattedPlanCards,
      });

      navigate(RouterPath.PLAN_SELECT);
    } catch (error) {
      console.error("플랜 저장 실패:", error);
    }
  };
  return (
    <PlanPageContainer>
      <InputWrapper>
        <Title />
        <MessageSilderWithAnimation />
        <Input
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <MicrophoneButton
          onStartClick={handleStartRecording}
          onStopClick={handleStopRecording}
          isRecording={isRecording}
        />
        <ButtonContainer>
          <Button onClick={handleNextClick}>다음</Button>
          <Button onClick={() => navigate(-1)} theme="secondary">
            취소
          </Button>
        </ButtonContainer>
      </InputWrapper>
    </PlanPageContainer>
  );
};

export default PlanPage;
