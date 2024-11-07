import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CustomCalendar, {
  CalendarEvent,
} from "../../components/features/CustomCalendar/CustomCalendar";
import {
  useGptLight,
  useGptModerate,
  useGptStrong,
} from "@/api/hooks/useTeamPlan";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";

const PageContainer = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const TeamPlanSelectPage: React.FC = () => {
  const { state } = useLocation();
  const { transcript } = state || {};
  const navigate = useNavigate();
  const deviceId = Cookies.get("device_id") || "defaultDeviceId";
  // 각 레벨별 플랜을 저장하는 객체 상태
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
      state: { plans: planCache[selectedLevel] }, // 현재 선택된 플랜 전달
    });
  };

  // 레벨에 따라 요청을 보내는 함수
  const handleFetchPlans = (level: "light" | "moderate" | "strong") => {
    if (planCache[level].length > 0) {
      setSelectedLevel(level);
      return; // 이미 캐싱된 값이 있을 경우 요청 생략
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
          console.log("응답 데이터:", data.planCards);
          setPlanCache((prevCache) => ({
            ...prevCache,
            [level]: data.planCards, // 각 레벨별 결과를 캐시에 저장
          }));
          console.log(data.planCards);
          setSelectedLevel(level);
          console.log(level);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("플랜 요청 실패:", error);
          setIsLoading(false);
        },
      },
    );
  };

  // 첫 화면 진입 시 자동으로 light 요청
  useEffect(() => {
    if (planCache.light.length === 0) {
      handleFetchPlans("light"); // 첫 진입 시 light 데이터 요청
    } else {
      setSelectedLevel("light"); // 캐싱된 light 데이터가 있을 경우 바로 설정
    }
  }, [planCache.light]);

  return (
    <PageContainer>
      <ButtonContainer>
        <button type="button" onClick={() => handleFetchPlans("light")}>
          1 (Light)
        </button>
        <button type="button" onClick={() => handleFetchPlans("moderate")}>
          2 (Moderate)
        </button>
        <button type="button" onClick={() => handleFetchPlans("strong")}>
          3 (Strong)
        </button>
      </ButtonContainer>

      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <CustomCalendar
          calendarOwner="Team Plans"
          plans={planCache[selectedLevel]}
          isReadOnly
        />
      )}
      <ButtonContainer>
        <Button onClick={handleNextClick} size="small">
          다음
        </Button>
        <Button onClick={() => navigate(-1)} theme="secondary" size="small">
          취소
        </Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default TeamPlanSelectPage;
