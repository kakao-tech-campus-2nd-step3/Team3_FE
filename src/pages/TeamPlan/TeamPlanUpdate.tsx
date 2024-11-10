// src/pages/TeamPlan/TeamPlanUpdatePage.tsx
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import Button from "@/components/common/Button/Button";
import useCreateTeam from "@/api/hooks/useCreateTeam";
import useSaveTeamPlan from "@/api/hooks/useTeamPlanSave";
import RouterPath from "@/router/RouterPath";
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

const TeamNameInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const TeamNameLabel = styled.span`
  font-size: 18px;
  margin-right: 8px;
`;

const TeamNameInput = styled.input`
  font-size: 18px;
  padding: 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  outline: none;
  width: 200px;

  &:focus {
    border-color: #39a7f7;
    box-shadow: 0 0 0 2px rgba(57, 167, 247, 0.2);
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

const convertToSavePlanFormat = (event: CalendarEvent) => ({
  title: event.title,
  description: event.description,
  startDate: event.start.toISOString(),
  endDate: event.end.toISOString(),
  accessibility: event.accessibility ?? true,
  isCompleted: event.complete ?? false,
});

const PlanUpdate = () => {
  const TitleMessages = [
    "플랜을 수정하거나, 바로 저장하세요.",
    "일정을 옮기고 크기를 조정하여 원하는대로 플랜을 수정해보세요.",
  ];
  const { state } = useLocation();
  const { plans: initialPlans } = state || {};
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const [teamName, setTeamName] = useState("");
  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>(
    initialPlans || [],
  );
  const createTeamMutation = useCreateTeam();
  const savePlanMutation = useSaveTeamPlan();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handlePlanChange = (plans: CalendarEvent[]) => {
    setModifiedPlans(plans);
  };

  const handleSave = async () => {
    if (!teamName) {
      alert("팀 이름을 입력해주세요.");
      return;
    }

    try {
      const teamResponse = await createTeamMutation.mutateAsync(teamName);
      const teamId = teamResponse.data.id;

      const savePlanPromises = modifiedPlans.map((plan) =>
        savePlanMutation.mutateAsync({
          teamId,
          plan: convertToSavePlanFormat(plan),
        }),
      );

      await Promise.all(savePlanPromises);

      alert("저장이 완료되었습니다!");
      navigate(RouterPath.TEAM_PLAN_INVITE, { state: { teamId } });
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
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

      <TeamNameInputContainer>
        <TeamNameLabel>팀의 이름을 정해주세요:</TeamNameLabel>
        <TeamNameInput
          value={teamName}
          onChange={handleTeamNameChange}
          placeholder="팀 이름 입력"
        />
      </TeamNameInputContainer>

      <CalendarContainer>
        <CustomCalendar
          plans={modifiedPlans}
          onPlanChange={handlePlanChange}
          isReadOnly={false}
        />
      </CalendarContainer>

      <ButtonContainer>
        <Button onClick={handleSave}>저장</Button>
        <Button theme="secondary" onClick={() => navigate(-1)}>
          취소
        </Button>
      </ButtonContainer>
    </PlanUpdateContainer>
  );
};

export default PlanUpdate;
