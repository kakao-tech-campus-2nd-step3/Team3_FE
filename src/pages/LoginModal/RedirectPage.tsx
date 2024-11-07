import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RouterPath from "@/router/RouterPath";
import useSavePreviewPlan from "@/api/hooks/useSavePreviewPlan";
import useAuth from "@/hooks/useAuth";
import { apiClient } from "@/api/instance";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const { setAuthState, authState } = useAuth();
  const { mutate: savePreviewPlan } = useSavePreviewPlan();
  const [hasSaved, setHasSaved] = useState(false);

  // 인증 처리를 위한 useEffect
  useEffect(() => {
    const handleAuth = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get("access");
      const refreshToken = queryParams.get("refresh");
      // const deviceId = queryParams.get("deviceId");

      if (!accessToken || !refreshToken) {
        navigate(RouterPath.LOGIN);
        return;
      }

      const cookieOptions = "path=/; Secure; SameSite=Strict;";
      document.cookie = `access_token=${accessToken}; ${cookieOptions}`;
      document.cookie = `refresh_token=${refreshToken}; ${cookieOptions}`;

      setAuthState({
        isAuthenticated: true,
        accessToken,
      });

      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    };

    handleAuth();
  }, []); // 빈 의존성 배열

  // 플랜 저장을 위한 useEffect
  useEffect(() => {
    const savePlans = async () => {
      if (!authState.isAuthenticated || hasSaved) return;

      const savedPlanData = localStorage.getItem("previewPlanData");
      if (!savedPlanData) {
        setHasSaved(true);
        navigate(RouterPath.MAIN);
        return;
      }

      try {
        const { selectedPlan, previewDeviceId, previewGroupId } =
          JSON.parse(savedPlanData);

        // 모든 플랜을 한 번에 전송
        const planDataList = selectedPlan.map((plan: CalendarEvent) => ({
          title: plan.title,
          description: plan.description,
          startDate: new Date(plan.start).toISOString(),
          endDate: new Date(plan.end).toISOString(),
        }));

        await savePreviewPlan({
          deviceId: previewDeviceId,
          groupId: previewGroupId,
          planDataList, // 전체 플랜 배열 전송
        });

        localStorage.removeItem("previewPlanData");
        setHasSaved(true);
        navigate(RouterPath.MAIN);
      } catch (error) {
        console.error("플랜 저장 실패:", error);
        navigate(RouterPath.MAIN);
      }
    };

    savePlans();
  }, [authState.isAuthenticated]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthRedirectHandler;
