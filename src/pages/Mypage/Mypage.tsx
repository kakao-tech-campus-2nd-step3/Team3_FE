import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@/components/common/List/List";
import { apiClient } from "@/api/instance";
import Button from "@/components/common/Button/Button"; // 버튼 컴포넌트 추가

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

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export default function MyPage() {
  const [userData, setUserData] = useState({
    nickname: "",
    profileImage: "",
    isPremium: false,
    email: "",
  });
  const [paymentData, setPaymentData] = useState({
    subscriptionId: 0,
    price: 0,
    paymentDate: "",
  });

  useEffect(() => {
    // 현재 로그인한 유저 정보 가져오기
    apiClient
      .get("/users/me")
      .then((response) => setUserData(response.data))
      .catch((error) => console.error("Error fetching user data:", error));

    // 결제 정보 가져오기 (예시로 paymentId 1을 사용)
    apiClient
      .get("/payment/1")
      .then((response) => setPaymentData(response.data))
      .catch((error) => console.error("Error fetching payment data:", error));
  }, []);

  const handlePaymentRequest = () => {
    // 결제 요청 API 호출
    apiClient
      .post("/payment", {
        subscriptionId: 1, // 예시로 구독 ID 1을 사용
        price: 10000, // 예시로 10,000원 결제
      })
      .then((response) => alert("결제 요청이 완료되었습니다."))
      .catch((error) => console.error("Error making payment request:", error));
  };

  const handleDeleteAccount = () => {
    // 회원 탈퇴 API 호출
    if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
      apiClient
        .delete("/users/me")
        .then(() => {
          alert("회원 탈퇴가 완료되었습니다.");
          // 추가적으로 로그아웃 처리 또는 리다이렉트 가능
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 프로필 카드 */}
        <Card>
          <List name={userData.nickname} date={`이메일: ${userData.email}`} />
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
              <ul>
                <li>결제 금액: {paymentData.price}원</li>
                <li>
                  결제일:{" "}
                  {new Date(paymentData.paymentDate).toLocaleDateString()}
                </li>
              </ul>
              <Button onClick={handlePaymentRequest}>결제 요청</Button>{" "}
              {/* 결제 요청 버튼 */}
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
                <li>
                  프리미엄 회원 여부: {userData.isPremium ? "예" : "아니오"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </GridLayout>

        {/* 회원 탈퇴 버튼 */}
        <DeleteButtonWrapper>
          <Button onClick={handleDeleteAccount} theme="secondary">
            회원 탈퇴
          </Button>
        </DeleteButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}
