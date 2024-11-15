// src/pages/TeamPlan/TeamPlanUpdatePage.tsx
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";

const PlanUpdateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const TitleContainer = styled.div`
  height: 70px;
  margin-bottom: 24px;
`;

const StyledText = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;

  ${breakpoints.mobile} {
    font-size: 20px;
    margin-top: 20px;
  }
`;

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const loginUrl = import.meta.env.VITE_LOGIN_URL;

const PreviewPlanUpdate = () => {
  const TitleMessages = [
    "플랜을 수정하거나, 바로 저장하세요.",
    "일정을 옮기고 크기를 조정하여 원하는대로 플랜을 수정해보세요.",
  ];
  const { state } = useLocation();
  const { plans: initialPlans } = state || {};
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>(
    initialPlans || [],
  );

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 플랜 수정 시 상태 업데이트
  const handlePlanChange = (plans: CalendarEvent[]) => {
    setModifiedPlans(plans);
  };

  // 플랜 삭제 시 상태 업데이트
  const handleDeletePlan = (planId: string) => {
    const updatedPlans = modifiedPlans.filter((plan) => plan.id !== planId);
    setModifiedPlans(updatedPlans);
  };

  const handleSave = async () => {
    // plans 데이터를 sessionStorage에 저장
    sessionStorage.setItem("plans", JSON.stringify(modifiedPlans));
    window.location.href = loginUrl;
  };

  return (
    <PlanUpdateContainer>
      <TitleContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <StyledText>{TitleMessages[currentMessageIndex]}</StyledText>
          </motion.div>
        </AnimatePresence>
      </TitleContainer>

      <CalendarContainer>
        <CustomCalendar
          plans={modifiedPlans}
          onPlanChange={handlePlanChange}
          onDeletePlan={handleDeletePlan}
          isReadOnly={false}
        />
      </CalendarContainer>

      <ButtonContainer>
        <Button onClick={handleSave} theme="kakao">
          카카오로 계속하기
        </Button>
        <Button theme="secondary" onClick={() => navigate(-1)}>
          취소
        </Button>
      </ButtonContainer>
    </PlanUpdateContainer>
  );
};

export default PreviewPlanUpdate;
