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

const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
`;

export default function MainlPage() {
  const location = useLocation();
  const { data: Plans, isLoading, error, refetch } = useGetPlans();
  const savePlanMutation = useCreatePlan();
  const isPlanSaved = useRef(false);
  const hasMounted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.refetchNeeded) {
      refetch();
    }
  }, [location, refetch]);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

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

    savePlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notification functionality
  useEffect(() => {
    const registerFcmToken = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const fcmToken = await requestForToken();
          if (fcmToken) {
            await apiClient.post("/api/fcm/register", { token: fcmToken });
            console.log("FCM 토큰이 성공적으로 등록되었습니다.");
          }
        } catch (err) {
          console.error("FCM 토큰 등록 중 오류 발생:", err);
        }
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    };

    registerFcmToken();
    setupOnMessageListener(); // Set up the listener for foreground messages
  }, []);

  const handleModifyClick = () => {
    navigate(RouterPath.MAIN_MODIFY, { state: { plans: Plans } });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  return (
    <PageContainer>
      <CustomCalendar plans={Plans} isReadOnly />
      <Button
        onClick={handleModifyClick}
        theme="primary"
        style={{ marginTop: "20px" }}
      >
        수정하기
      </Button>
    </PageContainer>
  );
}
