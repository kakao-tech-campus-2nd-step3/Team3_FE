// src/pages/MyPage.tsx
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import List from "@/components/common/List/List";
import Button from "@/components/common/Button/Button";
import useUserData from "@/api/hooks/useUserData";
import useAuth from "@/hooks/useAuth";
import RouterPath from "@/router/RouterPath";
import useFcmUpdate from "@/api/hooks/useFcmUpdate";
import { requestForToken } from "@/api/firebaseConfig";

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px; /* p-8 */
  overflow: auto;
`;

const Heading = styled.h1`
  font-size: 24px; /* text-3xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 24px; /* mb-6 */
  color: #2d3748; /* text-gray-800 */
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px; /* gap-6 */

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background-color: #ffffff; /* bg-white */
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-md */
  padding: 24px; /* p-6 */
  transition: box-shadow 0.2s; /* transition-shadow duration-200 */
  margin-bottom: 18px;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15); /* hover:shadow-lg */
  }
`;

const ProfileCard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff; /* bg-white */
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-md */
  padding: 24px; /* p-6 */
  transition: box-shadow 0.2s; /* transition-shadow duration-200 */
  margin-bottom: 18px;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15); /* hover:shadow-lg */
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px; /* mb-4 */
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-left: 8px; /* ml-2 */
  font-size: 18px; /* text-xl */
  font-weight: 600; /* font-semibold */
  color: #4a5568; /* text-gray-700 */
`;

const CardContent = styled.div`
  font-size: 14px;
  color: #4a5568; /* text-gray-700 */
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px; /* mt-6 */
  gap: 10px;
`;

export default function MyPage() {
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const { userData, handleDeleteAccount, handleSubscription } = useUserData();
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: updateFcm } = useFcmUpdate();

  // 초기 알림 상태 설정
  useEffect(() => {
    const storedToken = localStorage.getItem("fcmToken");
    setNotificationEnabled(!!storedToken);
  }, []);

  const handleNotificationToggle = async () => {
    try {
      const newState = !isNotificationEnabled;

      if (newState) {
        // 알림 켜기
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const fcmToken = await requestForToken();
          if (fcmToken) {
            await updateFcm({
              token: fcmToken,
              isNotificatioinEnabled: true,
            });
            localStorage.setItem("fcmToken", fcmToken);
            setNotificationEnabled(true);
            console.log("알람이 활성화 되었습니다.");
          }
        } else {
          alert(
            "알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.",
          );
          setNotificationEnabled(false);
        }
      } else {
        // 알람 끄기
        const currentToken = localStorage.getItem("fcmToken");
        if (currentToken) {
          await updateFcm({
            token: currentToken,
            isNotificatioinEnabled: false,
          });
          localStorage.removeItem("fcmToken");
        }
        setNotificationEnabled(false);
        console.log("알람이 비활성화 되었습니다.");
      }
    } catch (error) {
      console.error("알림 설정 변경 중 오류 발생:", error);
      alert("알림 설정 변경에 실패했습니다.");
      // 상태를 이전 값으로 되돌림
      setNotificationEnabled(!isNotificationEnabled);
    }
  };

  const handleSubscriptionClick = () => {
    if (userData.isPremium) {
      alert("이미 구독중입니다.");
    } else {
      handleSubscription();
    }
  };

  const handleLogout = () => {
    // 로그아웃 시 상태와 로컬 스토리지 초기화
    setAuthState({ isAuthenticated: false });
    localStorage.removeItem("authState");

    // 헤더의 인증 토큰 제거
    navigate(RouterPath.HOME);
  };

  const handleVisitClick = () => {
    navigate(`/friend/${userData.id}`, {
      state: { friendName: userData.nickname, userId: userData.id },
    });
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Heading>마이페이지</Heading>

        {/* 프로필 카드 */}
        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <List
            name={userData.nickname}
            date={userData.isPremium ? "프리미엄 회원" : "일반 회원"}
          />
          <Button size="small" theme="secondary" onClick={handleVisitClick}>
            방문
          </Button>
        </ProfileCard>

        {/* 정보 카드 그리드 */}
        <GridLayout>
          {/* 구독정보 카드 */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardHeader>
              <CreditCardIcon fontSize="small" style={{ color: "#4a5568" }} />
              <CardTitle>구독정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="small" onClick={handleSubscriptionClick}>
                결제 요청
              </Button>
            </CardContent>
          </Card>
          {/* 알림설정 카드 */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              opacity: isNotificationEnabled ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}
          >
            <CardHeader>
              <NotificationsIcon
                fontSize="small"
                style={{
                  color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                }}
              />
              <CardTitle
                style={{
                  color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                }}
              >
                알림설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                  }}
                >
                  알림 {isNotificationEnabled ? "켜짐" : "꺼짐"}
                </span>
                <Switch
                  checked={isNotificationEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                />
              </div>
              {!isNotificationEnabled && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                />
              )}
            </CardContent>
          </Card>
        </GridLayout>

        {/* 회원 탈퇴 버튼 */}
        <DeleteButtonWrapper>
          <Button onClick={handleLogout} size="small" theme="primary">
            로그아웃
          </Button>
          <Button onClick={handleDeleteAccount} size="small" theme="secondary">
            회원 탈퇴
          </Button>
        </DeleteButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}
