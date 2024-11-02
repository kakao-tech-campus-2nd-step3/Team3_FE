import styled from "@emotion/styled";
import Button from "@/components/common/Button/Button";
import NavBar from "@/components/features/Navbar/Navbar";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  padding: 0 20px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
`;

const LoginModal: React.FC = () => {
  const handleLogin = async () => {
    try {
      window.location.href =
        "https://api.splanet.co.kr/oauth2/authorization/kakao";
    } catch (e) {
      console.error("로그인 에러:", e);
    }
  };

  return (
    <>
      {/* Navbar */}
      <NavBar />

      {/* 로그인 페이지 컨테이너 */}
      <LoginContainer>
        <Title>로그인 페이지</Title>
        <Description>임시로 만든 로그인 페이지입니다.</Description>

        {/* Login 버튼 */}
        <Button theme="primary" onClick={handleLogin}>
          Login with Kakao
        </Button>
      </LoginContainer>
    </>
  );
};

export default LoginModal;
