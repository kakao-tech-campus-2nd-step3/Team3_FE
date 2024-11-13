import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import useCreatePlan from "@/api/hooks/useCreatePlan";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig"; // Import Firebase functions
import { apiClient } from "@/api/instance";
import useUserData from "@/api/hooks/useUserData";

const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-top: 40px;
`;

const ButtonWrapper = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;
export default function MainPage() {
  const location = useLocation();
  const { data: Plans, isLoading, error, refetch } = useGetPlans();
  const savePlanMutation = useCreatePlan();
  const isPlanSaved = useRef(false);
  const hasMounted = useRef(false);
  const navigate = useNavigate();
  const { userData } = useUserData();
  const isTokenRegistered = useRef(false);

  // FCM 토큰 등록 함수
  const registerFcmToken = async () => {
    // 이미 토큰이 등록되어 있다면 종료
    if (isTokenRegistered.current) {
      console.log("이미 FCM 토큰이 등록되어 있습니다.");
      return;
    }

    // localStorage에서 토큰 확인
    const storedToken = localStorage.getItem("fcmToken");
    if (storedToken) {
      console.log(
        "저장된 FCM 토큰을 사용합니다:",
        `${storedToken.slice(0, 10)}...`,
      );
      isTokenRegistered.current = true;
      return;
    }

    try {
      console.log("FCM 토큰 등록 시작...");
      const permission = await Notification.requestPermission();
      console.log("알림 권한 상태:", permission);

      if (permission === "granted") {
        const fcmToken = await requestForToken();
        if (fcmToken) {
          console.log("새로운 FCM 토큰 발급됨:", `${fcmToken.slice(0, 10)}...`);
          await apiClient.post("/api/fcm/register", { token: fcmToken });
          localStorage.setItem("fcmToken", fcmToken);
          isTokenRegistered.current = true;
          console.log("FCM 토큰 등록 완료");
        } else {
          console.warn("FCM 토큰이 null입니다.");
        }
      } else {
        console.warn("알림 권한이 거부되었습니다.");
      }
    } catch (err) {
      console.error("FCM 토큰 등록 중 오류 발생:", err);
    }
  };

  // 앱 초기 마운트시에만 FCM 토큰 등록 및 리스너 설정
  useEffect(() => {
    if (!hasMounted.current) {
      console.log("FCM 초기화 시작...");
      registerFcmToken().then(() => {
        console.log("FCM 초기화 완료");
        setupOnMessageListener();
      });
      hasMounted.current = true;
    }
  }, []);

  // Plans 관련 useEffect
  useEffect(() => {
    if (location.state?.refetchNeeded) {
      refetch();
    }
  }, [location, refetch]);

  // 세션 스토리지의 plans 저장 useEffect
  useEffect(() => {
    const savePlans = async () => {
      const storedPlans = sessionStorage.getItem("plans");
      if (storedPlans && !isPlanSaved.current) {
        const parsedPlans: CalendarEvent[] = JSON.parse(storedPlans).map(
          (plan: CalendarEvent) => ({
            ...plan,
            start: new Date(plan.start),
            end: new Date(plan.end),
          }),
        );

        try {
          await Promise.all(
            parsedPlans.map((plan) =>
              savePlanMutation.mutateAsync({
                plan: {
                  title: plan.title,
                  description: plan.description,
                  startDate: plan.start.toISOString(),
                  endDate: plan.end.toISOString(),
                  accessibility: plan.accessibility ?? true,
                  isCompleted: plan.complete ?? false,
                },
              }),
            ),
          );
          sessionStorage.removeItem("plans");
          console.log("세션의 플랜이 저장되었습니다.");
          isPlanSaved.current = true;
          refetch();
        } catch (err) {
          console.error("세션의 플랜 저장 실패:", err);
        }
      }
    };

    if (!isPlanSaved.current) {
      savePlans();
    }
  }, [savePlanMutation, refetch]);

  const handleVisitClick = () => {
    navigate(`/friend/${userData.id}`, {
      state: { Plans, friendName: userData.nickname, userId: userData.id },
    });
  };

  const handleModifyClick = () => {
    navigate(RouterPath.MAIN_MODIFY, { state: { plans: Plans } });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  return (
    <PageContainer>
      <CustomCalendar plans={Plans} isReadOnly />
      <ButtonWrapper>
        <Button onClick={handleModifyClick} theme="primary">
          수정하기
        </Button>
        <Button onClick={handleVisitClick} theme="secondary">
          방문하기
        </Button>
      </ButtonWrapper>
    </PageContainer>
  );
}
