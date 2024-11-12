// src/pages/TeamPlan/TeamPlanMaking.tsx
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useVoiceHook from "@/hooks/useVoiceHook";
import MicrophoneButton from "@/components/features/MicrophoneButton/MicrophoneButton";

const PlanPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #2d3748;
  text-align: center;
  margin-bottom: 24px;

  ${breakpoints.tablet} {
    font-size: 28px;
  }
`;

const SubTitle = styled.h2`
  font-size: 24px;
  font-weight: normal;
  color: #4a5568;
  text-align: center;
  margin-bottom: 32px;

  ${breakpoints.tablet} {
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 120px;
  margin-top: 32px;
`;

function MessageSliderWithAnimation() {
  const messages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMessageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <SubTitle>{messages[currentMessageIndex]}</SubTitle>
      </motion.div>
    </AnimatePresence>
  );
}

const TeamPlanMakingPage: React.FC = () => {
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
      <Title>팀 플랜 만들기</Title>
      <MessageSliderWithAnimation />
      <Input
        value={transcript}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setTranscript(e.target.value)
        }
        placeholder="원하는 일정을 입력하세요."
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
    </PlanPageContainer>
  );
};

export default TeamPlanMakingPage;
