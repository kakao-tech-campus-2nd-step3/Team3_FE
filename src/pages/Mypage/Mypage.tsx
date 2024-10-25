import styled from "@emotion/styled";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@/components/common/List/List";

const PageWrapper = styled.div`
  min-height: 100vh;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

export default function MyPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 프로필 카드 */}
        <Card>
          <List
            profileSrc="/placeholder.svg?height=96&width=96"
            name="홍길동"
            date="@hong_gildong"
          />
        </Card>

        {/* 정보 카드 그리드 */}
        <GridLayout>
          {/* 개인정보 카드 */}
          <Card>
            <CardHeader>
              <PersonIcon fontSize="small" />
              <CardTitle>개인정보</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>이메일: hong@example.com</li>
              </ul>
            </CardContent>
          </Card>

          {/* 결제정보 카드 */}
          <Card>
            <CardHeader>
              <CreditCardIcon fontSize="small" />
              <CardTitle>구독정보</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>만료일: 12/25</li>
              </ul>
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
                <li>이메일 알림: 켜짐</li>
                <li>푸시 알림: 켜짐</li>
                <li>SMS 알림: 꺼짐</li>
              </ul>
            </CardContent>
          </Card>

          {/* 계정설정 카드 */}
          <Card>
            <CardHeader>
              <SettingsIcon fontSize="small" />
              <CardTitle>계정설정</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>aaa</li>
              </ul>
            </CardContent>
          </Card>
        </GridLayout>
      </ContentWrapper>
    </PageWrapper>
  );
}
