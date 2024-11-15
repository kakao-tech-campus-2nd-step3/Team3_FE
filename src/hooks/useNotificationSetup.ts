import { useEffect, useRef } from "react";
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";

const FCM_TOKEN_KEY = "fcm_token";

// 모듈 레벨에서 전역 플래그 선언
let isTokenRequestedGlobal = false;

const useNotificationSetup = () => {
  const tokenRequestedRef = useRef(false);

  // 브라우저별 알림 설정 안내 메시지
  const openNotificationSettings = () => {
    const { userAgent } = navigator;
    if (userAgent.includes("Edg")) {
      alert(
        "Edge 설정에서 알림을 활성화해주세요. \n설정 > 쿠키 및 사이트 권한 > 알림",
      );
    } else if (userAgent.includes("Chrome")) {
      alert(
        "Chrome 설정에서 알림을 활성화해주세요. \n설정 > 개인정보 및 보안 > 사이트 설정 > 알림",
      );
    } else if (userAgent.includes("Firefox")) {
      alert(
        "Firefox 설정에서 알림을 활성화해주세요. \n설정 페이지에서 개인정보 및 보안 > 권한 > 알림",
      );
    } else {
      alert("알림을 활성화하려면 브라우저 설정을 확인해주세요.");
    }
  };

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
            openNotificationSettings();
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
            openNotificationSettings();
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
    openNotificationSettings,
  };
};

export default useNotificationSetup;
