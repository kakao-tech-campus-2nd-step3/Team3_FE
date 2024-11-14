// src/pages/Plan/PlanSelectPage.tsx
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Rings } from "react-loader-spinner";
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

const PlanSelectPage: React.FC = () => {
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

  const { mutateAsync: fetchLightPlansAsync } = useGptLight();
  const { mutateAsync: fetchModeratePlansAsync } = useGptModerate();
  const { mutateAsync: fetchStrongPlansAsync } = useGptStrong();

  const handleNextClick = async () => {
    navigate(RouterPath.PLAN_UPDATE, {
      state: { plans: planCache[selectedLevel] },
    });
  };

  const handleFetchPlans = (level: "light" | "moderate" | "strong") => {
    setSelectedLevel(level);
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchPlans = async () => {
      try {
        const [lightData, moderateData, strongData] = await Promise.all([
          fetchLightPlansAsync({
            deviceId,
            text: transcript || "기본 추천 텍스트",
          }),
          fetchModeratePlansAsync({
            deviceId,
            text: transcript || "기본 추천 텍스트",
          }),
          fetchStrongPlansAsync({
            deviceId,
            text: transcript || "기본 추천 텍스트",
          }),
        ]);

        // 응답 데이터 검증
        if (
          typeof lightData === "string" ||
          typeof moderateData === "string" ||
          typeof strongData === "string"
        ) {
          const responseData = [
            // typeof lightData === "string" ? `1번째 AI답변: ${lightData}` : null,
            // typeof moderateData === "string"
            //   ? `\n2번째 AI답변: ${moderateData}`
            //   : null,
            typeof strongData === "string" ? `${strongData}` : null,
          ]
            .filter((data) => data !== null)
            .join("\n");

          alert(`잘못된 요청입니다. \n${responseData}`);
          navigate(-1);
        } else {
          setPlanCache({
            light: lightData.planCards,
            moderate: moderateData.planCards,
            strong: strongData.planCards,
          });
          setSelectedLevel("light");
        }
      } catch (error: unknown) {
        setIsLoading(false);

        // 에러가 AxiosError인지 확인
        if (axios.isAxiosError(error)) {
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
        } else {
          alert("예기치 못한 오류가 발생했습니다.");
        }
        navigate(-1); // 이전 페이지로 이동
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Rings
            height="100"
            width="100"
            color="#39A7F7"
            ariaLabel="rings-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible
          />
          <p>플랜을 생성하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
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

export default PlanSelectPage;
