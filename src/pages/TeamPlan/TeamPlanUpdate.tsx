import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import Button from "@/components/common/Button/Button";
import useCreateTeam from "@/api/hooks/useCreateTeam";
import useSaveTeamPlan from "@/api/hooks/useTeamPlanSave";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";

// 슬라이드 애니메이션
const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 전체 컨테이너
const PlanUpdateContainer = styled.div`
  display: grid;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  margin-top: 20px;
`;

// 내용 래퍼
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

// 캘린더 컨테이너
const CalendarContainer = styled.div`
  width: 100%;
`;

// 텍스트 스타일
const StyledText = styled.p`
  font-size: 23px;
  font-weight: bold;
  text-align: center;

  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
  ${breakpoints.mobile} {
    font-size: 16px;
    margin-top: 20px;
  }
`;

const StyledTextContainer = styled.div`
  height: 70px;
`;

// 버튼 섹션
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 130px;
  margin-bottom: 30px;
`;

const TeamNameInput = styled.input`
  font-size: 20px;
  padding: 8px;
  margin-left: 10px;
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
    "일정을 옮기고 크기를 조정하여 원하는대로 플랜을 수정해보세요",
  ];
  const { state } = useLocation();
  const { plans: initialPlans } = state || {}; // 이전 페이지에서 전달된 plans
  // 메시지 애니메이션과 인덱스 상태
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 상태 정의
  const [teamName, setTeamName] = useState("");
  // 초기 modifiedPlans에 전달된 plans 데이터 설정
  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>(
    initialPlans || [],
  );
  const createTeamMutation = useCreateTeam();
  const savePlanMutation = useSaveTeamPlan();
  const navigate = useNavigate();

  // 메시지와 애니메이션 설정
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 5000);
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
      // 팀 생성 요청
      const teamResponse = await createTeamMutation.mutateAsync(teamName);
      const teamId = teamResponse.data.id;

      // 모든 플랜을 저장하는 비동기 작업 생성
      const savePlanPromises = modifiedPlans.map((plan) =>
        savePlanMutation.mutateAsync({
          teamId,
          plan: convertToSavePlanFormat(plan), // 변환 후 전달
        }),
      );

      // 모든 비동기 작업을 병렬로 실행
      await Promise.all(savePlanPromises);

      // for (const plan of modifiedPlans) {
      //   await savePlanMutation.mutateAsync({
      //     teamId,
      //     plan: convertToSavePlanFormat(plan), // 변환 후 전달
      //   });
      // }

      alert("저장이 완료되었습니다!");
      navigate(RouterPath.TEAM_PLAN_INVITE, { state: { teamId } });
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <PlanUpdateContainer>
      <ContentWrapper>
        <StyledTextContainer>
          <StyledText className={animate ? "animate" : ""}>
            {TitleMessages[currentMessageIndex]}
          </StyledText>
        </StyledTextContainer>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span>팀의 이름을 정해주세요:</span>
          <TeamNameInput
            value={teamName}
            onChange={handleTeamNameChange}
            placeholder="팀 이름 입력"
          />
        </div>

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
      </ContentWrapper>
    </PlanUpdateContainer>
  );
};

export default PlanUpdate;
