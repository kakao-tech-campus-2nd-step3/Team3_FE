// src/pages/Plan/PlanPage.tsx
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Joyride, { Step } from "react-joyride";
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
  margin-bottom: 24px;
  min-height: 60px;
  ${breakpoints.tablet} {
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 120px;
  margin-top: 32px;
`;

const planPageSteps: Step[] = [
  {
    target: ".input-area", // Input 컴포넌트 타겟
    content:
      "기존 일정, 할 일들의 예상 소요시간을 구체적으로 말해주시면 더 좋아요. ",
  },
];

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

const PlanPage: React.FC = () => {
  const [runGuide, setRunGuide] = useState(false); // 가이드 실행 여부
  const [stepIndex, setStepIndex] = useState(0); // 현재 가이드 단계

  const handleJoyrideCallback = (data: any) => {
    const { status, action, index } = data;

    if (status === "finished" || status === "skipped") {
      localStorage.setItem("hasSeenPlanGuide", "true"); // 가이드 완료 상태 저장
      setRunGuide(false);
    }

    if (action === "next") {
      setStepIndex(index + 1); // 다음 단계로 이동
    }
  };

  useEffect(() => {
    // PlanPage 가이드를 처음 보는 경우 실행
    const hasSeenGuide = localStorage.getItem("hasSeenPlanGuide");
    if (!hasSeenGuide) {
      setRunGuide(true);
    }
  }, []);

  const {
    transcript,
    setTranscript,
    isRecording,
    handleStartRecording,
    handleStopRecording,
  } = useVoiceHook();
  const navigate = useNavigate();

  const handleNextClick = async () => {
    if (!transcript || transcript.trim() === "") {
      alert("입력값이 필요합니다.");
      return;
    }
    navigate(RouterPath.PLAN_SELECT, { state: { transcript } });
  };

  return (
    <PlanPageContainer>
      <Joyride
        steps={planPageSteps}
        continuous
        showSkipButton
        run={runGuide}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: "#ffffff",
            backgroundColor: "#ffffff",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            primaryColor: "#39A7F7",
            textColor: "#333333",
            zIndex: 10000,
          },
        }}
        locale={{
          next: "다음", // Next 버튼
          last: "마침", // Last 버튼
          skip: "건너뛰기", // Skip 버튼
          back: "뒤로", // Back 버튼
          close: "닫기", // Close 버튼
        }}
      />

      <Title>플랜을 생성해보세요.</Title>
      <MessageSliderWithAnimation />
      <Input
        value={transcript}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setTranscript(e.target.value)
        }
        placeholder="원하는 일정을 자유롭게 입력해보세요."
        className="input-area"
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

export default PlanPage;
