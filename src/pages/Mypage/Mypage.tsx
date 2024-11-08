import { useState } from "react";
import styled from "@emotion/styled";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Switch from "@mui/material/Switch";
import List from "@/components/common/List/List";
import Button from "@/components/common/Button/Button";
import useUserData from "@/api/hooks/useUserData";

const PageWrapper = styled.div`
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: #f4f4f4;
  border-radius: 16px;
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const CardContent = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export default function MyPage() {
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const { userData, handleDeleteAccount, handleSubscription } = useUserData();

  const handleNotificationToggle = () => {
    setNotificationEnabled(!isNotificationEnabled);
  };

  const handleSubscriptionClick = () => {
    if (userData.isPremium) {
      alert("이미 구독중입니다.");
    } else {
      handleSubscription();
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 프로필 카드 */}
        <Card>
          <List
            name={userData.nickname}
            date={userData.isPremium ? "프리미엄 회원" : "일반 회원"}
          />
        </Card>

        {/* 정보 카드 그리드 */}
        <GridLayout>
          {/* 결제정보 카드 */}
          <Card>
            <CardHeader>
              <CreditCardIcon fontSize="small" />
              <CardTitle>구독정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="small" onClick={handleSubscriptionClick}>
                결제 요청
              </Button>
            </CardContent>
          </Card>

          {/* 알림설정 카드 */}
          <Card>
            <CardHeader>
              <NotificationsIcon fontSize="small" />
              <CardTitle>알림설정</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>알림 켜기</li>
              </ul>
              <Switch
                checked={isNotificationEnabled}
                onChange={handleNotificationToggle}
              />
            </CardContent>
          </Card>
        </GridLayout>

        {/* 회원 탈퇴 버튼 */}
        <DeleteButtonWrapper>
          <Button onClick={handleDeleteAccount} size="small" theme="secondary">
            회원 탈퇴
          </Button>
        </DeleteButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}
