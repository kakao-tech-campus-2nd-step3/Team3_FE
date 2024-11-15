import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Switch from "@mui/material/Switch";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import List from "@/components/common/List/List";
import Button from "@/components/common/Button/Button";
import useUserData from "@/api/hooks/useUserData";
import useAuth from "@/hooks/useAuth";
import breakpoints from "@/variants/breakpoints";
import { requestForToken } from "@/api/firebaseConfig";
import useFcmOffsetUpdate from "@/api/hooks/useFcmOffsetUpdate";

// 알림 설정 안내 문구를 표시하는 훅
const useNotificationSetup = () => {
  const openNotificationSettings = () => {
    const { userAgent } = navigator;
    if (userAgent.includes("Edg")) {
      alert(
        "Edge 설정에서 알림을 활성화해주세요:\n설정 > 쿠키 및 사이트 권한 > 알림",
      );
    } else if (userAgent.includes("Chrome")) {
      alert(
        "Chrome 설정에서 알림을 활성화해주세요:\n설정 > 개인정보 및 보안 > 사이트 설정 > 알림",
      );
    } else if (
      userAgent.includes("Safari") &&
      !userAgent.includes("Chrome") &&
      !userAgent.includes("Edg")
    ) {
      alert(
        "Safari 설정에서 알림을 활성화해주세요:\nmacOS에서는 Safari > 설정 > 알림\niOS에서는 설정 > Safari > 알림",
      );
    } else if (userAgent.includes("Firefox")) {
      alert(
        "Firefox 설정에서 알림을 활성화해주세요:\n설정 페이지에서 개인정보 및 보안 > 권한 > 알림",
      );
    } else {
      alert("알림을 활성화하려면 브라우저 설정을 확인해주세요.");
    }
  };

  return { openNotificationSettings };
};

// 스타일드 컴포넌트 정의
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px;
  overflow: auto;

  ${breakpoints.mobile} {
    padding: 16px;
  }
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;

  ${breakpoints.mobile} {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s;
  margin-bottom: 18px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  ${breakpoints.mobile} {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const ProfileCard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s;
  margin-bottom: 18px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  ${breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  ${breakpoints.mobile} {
    margin-bottom: 8px;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-left: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #4a5568;

  ${breakpoints.mobile} {
    font-size: 16px;
  }
`;

const CardContent = styled.div`
  font-size: 14px;
  color: #4a5568;

  ${breakpoints.mobile} {
    font-size: 13px;
  }
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 10px;

  ${breakpoints.mobile} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const StyledSelect = styled((props: SelectProps<string>) => (
  <Select {...props} />
))`
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 14px;

  .MuiSelect-select {
    padding: 12px 16px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;

    &:focus {
      background-color: #f8fafc;
      border-color: #3182ce;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 12px 16px;
  font-size: 14px;
  color: #4a5568;

  &:hover {
    background-color: #f8fafc;
  }

  &.Mui-selected {
    background-color: #ebf8ff;

    &:hover {
      background-color: #ebf8ff;
    }
  }
`;

const FCM_TOKEN_KEY = "fcm_token";
const FCM_OFFSET_KEY = "fcm_offset";

export default function MyPage() {
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const { userData, handleDeleteAccount, handleSubscription } = useUserData();
  const { setAuthState } = useAuth();
  const { openNotificationSettings } = useNotificationSetup();
  const fcmOffsetUpdateMutation = useFcmOffsetUpdate();
  const [notificationOffset, setNotificationOffset] = useState<string>(() => {
    return localStorage.getItem(FCM_OFFSET_KEY) || "0";
  });

  useEffect(() => {
    const savedToken = localStorage.getItem(FCM_TOKEN_KEY);
    setNotificationEnabled(!!savedToken);
  }, []);

  const handleNotificationToggle = async () => {
    try {
      const newState = !isNotificationEnabled;

      if (newState) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          openNotificationSettings();
          return;
        }

        const newToken = await requestForToken();
        if (!newToken) {
          throw new Error("알림 토큰 발급 실패");
        }

        localStorage.setItem(FCM_TOKEN_KEY, newToken);
        setNotificationEnabled(true);
      } else {
        const currentToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (currentToken) {
          localStorage.removeItem(FCM_TOKEN_KEY);
          localStorage.removeItem(FCM_OFFSET_KEY);
          setNotificationEnabled(false);
        }
      }
    } catch (error) {
      alert("알림 설정 변경에 실패했습니다.");
      setNotificationEnabled(!isNotificationEnabled);
    }
  };

  const handleOffsetChange = async (event: SelectChangeEvent<string>) => {
    const newOffset = event.target.value;

    try {
      const currentToken = localStorage.getItem(FCM_TOKEN_KEY);

      if (!currentToken) {
        throw new Error("FCM 토큰이 없습니다. 알림을 다시 활성화해주세요.");
      }

      await fcmOffsetUpdateMutation.mutateAsync({
        token: currentToken,
        notificationOffset: parseInt(newOffset, 10),
      });

      setNotificationOffset(newOffset);
      localStorage.setItem(FCM_OFFSET_KEY, newOffset);
    } catch (error) {
      alert("알림 시간 설정에 실패했습니다.");
      const previousOffset = localStorage.getItem(FCM_OFFSET_KEY) || "0";
      setNotificationOffset(previousOffset);
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Heading>마이페이지</Heading>
        <ProfileCard>
          <List
            name={userData.nickname}
            date={userData.isPremium ? "프리미엄 회원" : "일반 회원"}
          />
        </ProfileCard>
        <GridLayout>
          <Card>
            <CardHeader>
              <CreditCardIcon fontSize="small" style={{ color: "#4a5568" }} />
              <CardTitle>구독정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="small" onClick={handleSubscription}>
                결제 요청
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <NotificationsIcon
                fontSize="small"
                style={{ color: isNotificationEnabled ? "#4a5568" : "#9ca3af" }}
              />
              <CardTitle
                style={{ color: isNotificationEnabled ? "#4a5568" : "#9ca3af" }}
              >
                알림설정
              </CardTitle>
              <Switch
                checked={isNotificationEnabled}
                onChange={handleNotificationToggle}
                color="primary"
              />
            </CardHeader>
            <CardContent>
              {isNotificationEnabled && (
                <FormControl fullWidth size="small">
                  <StyledSelect
                    value={notificationOffset}
                    onChange={handleOffsetChange}
                    displayEmpty
                  >
                    <StyledMenuItem value="0">알림 설정</StyledMenuItem>
                    <StyledMenuItem value="5">5분 전</StyledMenuItem>
                    <StyledMenuItem value="10">10분 전</StyledMenuItem>
                    <StyledMenuItem value="15">15분 전</StyledMenuItem>
                    <StyledMenuItem value="20">20분 전</StyledMenuItem>
                    <StyledMenuItem value="25">25분 전</StyledMenuItem>
                    <StyledMenuItem value="30">30분 전</StyledMenuItem>
                  </StyledSelect>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </GridLayout>
        <DeleteButtonWrapper>
          <Button onClick={handleDeleteAccount} size="small" theme="secondary">
            회원 탈퇴
          </Button>
          <Button
            onClick={() => setAuthState({ isAuthenticated: false })}
            size="small"
            theme="primary"
          >
            로그아웃
          </Button>
        </DeleteButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}
