import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import {
  useGptTrialLight,
  useGptTrialModerate,
  useGptTrialStrong,
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

const PreviewPlanSelectPage: React.FC = () => {
  const { state } = useLocation();
  const { transcript, deviceId } = state || {};
  const navigate = useNavigate();

  const [planCache, setPlanCache] = useState<Record<string, CalendarEvent[]>>({
    light: [],
    moderate: [],
    strong: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<
    "light" | "moderate" | "strong"
  >("light");

  const { mutate: fetchLightPlans } = useGptTrialLight();
  const { mutate: fetchModeratePlans } = useGptTrialModerate();
  const { mutate: fetchStrongPlans } = useGptTrialStrong();
  
  const handleNextClick = async () => {
    navigate(RouterPath.PREVIEW_PLAN_UPDATE, {
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
          if (typeof data === "string") {
            alert(`잘못된 입력값입니다.\n응답데이터: ${data}`);
            navigate(-1); // 이전 페이지로 이동
          } else {
            setPlanCache((prevCache) => ({
              ...prevCache,
              [level]: data.planCards,
            }));
            setSelectedLevel(level);
          }
          setIsLoading(false);
        },
        onError: (error: AxiosError) => {
          if (error.response) {
            if (error.response.status === 400) {
              alert("잘못된 요청입니다.");
            } else if (error.response.status === 500) {
              alert("서버 내부 오류입니다.");
            } else {
              alert("플랜 요청 실패: 알 수 없는 오류");
            }
          } else {
            alert(
              "네트워크 오류가 발생했습니다. 유효한 입력값인지 확인해주세요.",
            );
          }
          setIsLoading(false);
          navigate(-1); // 이전 페이지로 이동
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
          <CustomCalendar plans={planCache[selectedLevel]} isReadOnly />
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

export default PreviewPlanSelectPage;
