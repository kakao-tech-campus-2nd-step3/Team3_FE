import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import useLogin from "@/api/hooks/useLogin";
import Button from "@/components/common/Button/Button";
import { NavBar } from "../Landing/LandingPage";
import logoSVG from "@/assets/logo.svg";
import breakpoints from "@/variants/breakpoints";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  padding: 0 20px;
  background-color: #f9f9f9;
`;
const Logo = styled.img`
  height: 50px;

  ${breakpoints.tablet} {
    height: 70px;
  }
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
`;

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { login, error } = useLogin();

  const handleLogin = async () => {
    try {
      await login(); // `useLogin`의 `login` 함수를 호출
      navigate("/main"); // 로그인 성공 시 메인 페이지로 이동
    } catch (e) {
      console.error("로그인 에러:", e);
    }
  };

  return (
    <>
      {/* Navbar */}
      <NavBar>
        <Logo src={logoSVG} alt="로고" />
      </NavBar>

      {/* 로그인 페이지 컨테이너 */}
      <LoginContainer>
        <Title>로그인 페이지</Title>
        <Description>임시로 만든 로그인 페이지입니다.</Description>

        {/* Login 버튼 */}
        <Button theme="primary" onClick={handleLogin}>
          Login with Kakao
        </Button>

        {/* 에러 메시지 */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginContainer>
    </>
  );
};

export default LoginModal;
