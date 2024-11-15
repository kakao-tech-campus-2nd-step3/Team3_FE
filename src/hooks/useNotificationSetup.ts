import { useEffect, useRef } from "react";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

const FCM_TOKEN_KEY = "fcm_token";

// 모듈 레벨에서 전역 플래그 선언
let isTokenRequestedGlobal = false;

const useNotificationSetup = () => {
  const tokenRequestedRef = useRef(false);

  useEffect(() => {
    const initializeFCM = async () => {
      // 알림 API 지원 여부 확인
      if (!("Notification" in window)) {
        alert("현재 사용 중인 브라우저는 알림 기능을 지원하지 않습니다.");
        return;
      }

      // 이미 토큰 요청이 진행 중이거나 완료된 경우 중복 실행 방지
      if (isTokenRequestedGlobal || tokenRequestedRef.current) {
        return;
      }

      try {
        isTokenRequestedGlobal = true; // 전역 플래그 설정
        tokenRequestedRef.current = true;

        const existingToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (!existingToken) {
          if (Notification.permission === "denied") {
            return;
          }

          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const fcmToken = await requestForToken();
            if (fcmToken) {
              await apiClient.post("/api/fcm/register", { token: fcmToken });
              localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
              console.log("New FCM token registered and saved:", fcmToken);
            }
          } else if (permission === "denied") {
            alert(
              "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 활성화해주세요.",
            );
          }
        }

        // 메시지 리스너 설정
        setupOnMessageListener();
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
        // 에러 발생 시 플래그 초기화
        isTokenRequestedGlobal = false;
        tokenRequestedRef.current = false;
      }
    };

    initializeFCM();

    return () => {
      tokenRequestedRef.current = false;
    };
  }, []);

  const getFCMToken = () => {
    return localStorage.getItem(FCM_TOKEN_KEY);
  };

  return {
    getFCMToken,
  };
};

export default useNotificationSetup;
