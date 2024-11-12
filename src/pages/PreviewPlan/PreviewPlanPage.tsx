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
  const { data: deviceId, isLoading: isDeviceIdLoading } =
    useGenerateDeviceId();
  const gptRequestMutation = useGptTrial();
  const savePlanMutation = useSavePlan({
    onSuccess: (data) => {
      console.log("플랜 저장 성공:", data);
    },
    onError: (error) => {
      console.error("플랜 저장 실패:", error);
      alert("플랜 저장에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSaveClick = async () => {
    if (!deviceId) {
      alert("Device ID를 생성하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!transcript.trim()) {
      alert("플랜 내용을 입력해주세요.");
      return;
    }

    try {
      // GPT 요청 보내기
      const gptResponses = await gptRequestMutation.mutateAsync({
        deviceId,
        text: transcript,
      });

      if (!gptResponses || !Array.isArray(gptResponses)) {
        console.error("GPT 응답이 비어있거나 잘못된 형식입니다:", gptResponses);
        return;
      }

      console.log("GPT 응답 데이터:", gptResponses);

      // save API 호출 및 각 요청 결과 처리
      const saveResults = await Promise.allSettled(
        gptResponses.map(async (response) => {
          try {
            const { groupId, planCards } = response;

            // planCards가 배열인지 확인
            if (!Array.isArray(planCards)) {
              throw new Error(
                `Invalid planCards format for groupId: ${groupId}`,
              );
            }

            const savedResponse = await savePlanMutation.mutateAsync({
              deviceId,
              groupId,
              planCards: planCards.map((card) => ({
                ...card,
                accessibility: true,
                isCompleted: false,
              })),
            });

            // 저장 성공시 groupId를 포함하여 반환
            return { success: true, groupId, response: savedResponse };
          } catch (error) {
            console.error("Plan save error:", error);
            return { success: false, error };
          }
        }),
      );

      // 결과 분석
      const successfulSaves = saveResults.filter(
        (result) =>
          result.status === "fulfilled" && result.value && result.value.success,
      );

      console.log("Save results:", saveResults);
      console.log("Successful saves:", successfulSaves);

      if (successfulSaves.length > 0) {
        // 저장된 플랜이 하나 이상 있으면 다음 페이지로 이동
        navigate(RouterPath.PREVIEW_PLAN_SELECT, {
          state: {
            speechText: transcript,
            // 필요한 경우 성공적으로 저장된 groupId들을 전달
            savedGroupIds: successfulSaves
              .map(
                (result) =>
                  result.status === "fulfilled" && result.value.groupId,
              )
              .filter(Boolean),
          },
        });
      } else {
        alert("플랜 저장에 실패했습니다. 다시 시도해주세요.");
        console.error("모든 플랜 저장 실패:", saveResults);
      }
    } catch (error) {
      console.error("GPT 요청 또는 플랜 저장 실패:", error);
      alert("플랜 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isDeviceIdLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PlanPageContainer>
      <InputWrapper>
        <Title>플랜을 생성하세요</Title>
        <MessageSilderWithAnimation />
        <Input
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="플랜 내용을 입력하거나 음성으로 말씀해주세요"
        />
        <MicrophoneButton
          onStartClick={handleStartRecording}
          onStopClick={handleStopRecording}
          isRecording={isRecording}
        />
        <ButtonContainer>
          <Button
            size="responsive"
            onClick={handleSaveClick}
            disabled={isDeviceIdLoading || !transcript.trim()}
          >
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
