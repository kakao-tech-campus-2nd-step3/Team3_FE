import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/features/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useVoiceHook from "@/hooks/useVoiceHook";
// import useGenerateDeviceId from "@/api/hooks/useGenerateDeviceId";

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

const TeamPlanMakingPage: React.FC = () => {
  // const { data: deviceId } = useGenerateDeviceId();
  const {
    transcript,
    setTranscript,
    isRecording,
    handleStartRecording,
    handleStopRecording,
  } = useVoiceHook();
  const navigate = useNavigate();

  const handleNextClick = async () => {
    navigate(RouterPath.TEAM_PLAN_SELECT, { state: { transcript } });
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

export default TeamPlanMakingPage;
