// src/pages/TeamPlan/TeamPlanSelectPage.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import {
  useGptLight,
  useGptModerate,
  useGptStrong,
} from "@/api/hooks/useGeneratePlans";
import Button from "@/components/common/Button/Button";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 24px;

  @media (max-width: ${breakpoints.sm}px) {
    padding: 0 20px;
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 120px;
`;

const TeamPlanSelectPage: React.FC = () => {
  const { state } = useLocation();
  const { transcript } = state || {};
  const navigate = useNavigate();
  const deviceId = Cookies.get("device_id") || "defaultDeviceId";

  const [planCache, setPlanCache] = useState<Record<string, CalendarEvent[]>>({
    light: [],
    moderate: [],
    strong: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<
    "light" | "moderate" | "strong"
  >("light");

  const { mutate: fetchLightPlans } = useGptLight();
  const { mutate: fetchModeratePlans } = useGptModerate();
  const { mutate: fetchStrongPlans } = useGptStrong();

  const handleNextClick = async () => {
    navigate(RouterPath.TEAM_PLAN_UPDATE, {
      state: { plans: planCache[selectedLevel] },
    });
  };

  const handleFetchPlans = (level: "light" | "moderate" | "strong") => {
    if (planCache[level].length > 0) {
      setSelectedLevel(level);
      return;
    }
    setIsLoading(true);

    let fetchFn;
    if (level === "light") {
      fetchFn = fetchLightPlans;
    } else if (level === "moderate") {
      fetchFn = fetchModeratePlans;
    } else {
      fetchFn = fetchStrongPlans;
    }

    fetchFn(
      { deviceId, text: transcript || "기본 추천 텍스트" },
      {
        onSuccess: (data) => {
          setPlanCache((prevCache) => ({
            ...prevCache,
            [level]: data.planCards,
          }));
          setSelectedLevel(level);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("플랜 요청 실패:", error);
          setIsLoading(false);
        },
      },
    );
  };

  useEffect(() => {
    if (planCache.light.length === 0) {
      handleFetchPlans("light");
    } else {
      setSelectedLevel("light");
    }
  }, []);

  return (
    <PageContainer>
      <Title>원하는 플랜을 선택하세요</Title>
      <ButtonContainer>
        <NumberButton
          number={1}
          clicked={selectedLevel === "light"}
          onClick={() => handleFetchPlans("light")}
        />
        <NumberButton
          number={2}
          clicked={selectedLevel === "moderate"}
          onClick={() => handleFetchPlans("moderate")}
        />
        <NumberButton
          number={3}
          clicked={selectedLevel === "strong"}
          onClick={() => handleFetchPlans("strong")}
        />
      </ButtonContainer>

      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <CalendarContainer>
          <CustomCalendar
            calendarOwner="Team Plans"
            plans={planCache[selectedLevel]}
            isReadOnly
          />
        </CalendarContainer>
      )}
      <ActionButtonContainer>
        <Button onClick={handleNextClick}>다음</Button>
        <Button onClick={() => navigate(-1)} theme="secondary">
          취소
        </Button>
      </ActionButtonContainer>
    </PageContainer>
  );
};

export default TeamPlanSelectPage;
