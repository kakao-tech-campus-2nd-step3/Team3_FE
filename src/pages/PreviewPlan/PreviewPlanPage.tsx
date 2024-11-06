import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/features/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useVoiceHook from "@/hooks/useVoiceHook";
import useGptTrial from "@/api/hooks/useGptTrial";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return <SubTitle>{messages[currentMessageIndex]}</SubTitle>;
}

const PreviewPlanPage: React.FC = () => {
  const {
    transcript,
    setTranscript,
    isRecording,
    handleStartRecording,
    handleStopRecording,
  } = useVoiceHook();
  const navigate = useNavigate();

  const { data: deviceId } = useGenerateDeviceId();
  const gptRequestMutation = useGptTrial();
  const savePlanMutation = useSavePlan();

  const handleSaveClick = async () => {
    if (!deviceId) {
      alert("Device ID를 생성하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      // GPT 요청 보내기
      const gptResponses = await gptRequestMutation.mutateAsync({
        deviceId,
        text: transcript,
      });

      console.log("GPT 응답 데이터:", gptResponses);

      // GPT 응답 데이터를 그대로 save API 호출에 전달
      await Promise.all(
        gptResponses.map((response) => {
          const { groupId, planCards } = response;
          return savePlanMutation.mutateAsync({
            deviceId,
            groupId,
            planCards: planCards.map((card) => ({
              ...card, // title, description, startDate, endDate를 그대로 유지
              accessibility: card.accessibility || true,
              isCompleted: card.isCompleted || false,
            })),
          });
        }),
      );

      navigate(RouterPath.PREVIEW_PLAN_SELECT);
    } catch (error) {
      console.error("GPT 요청 또는 플랜 저장 실패:", error);
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
          <Button size="responsive" onClick={handleSaveClick}>
            다음
          </Button>
          <Button
            theme="secondary"
            size="responsive"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
        </ButtonContainer>
      </InputWrapper>
    </PlanPageContainer>
  );
};

export default PreviewPlanPage;
