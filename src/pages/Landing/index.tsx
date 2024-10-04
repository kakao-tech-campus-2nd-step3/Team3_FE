import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import circleSVG from "@/assets/circle (1).svg"; // 원형 이미지
import mockSVG from "@/assets/mock.svg"; // 목업 이미지

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/plan/preview");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <LandingContainer>
      <ContentWrapper>
        <TextWrapper>
          <Title>간편하고 빠른 플랜 생성</Title>
          <SubTitle>내 목소리로 일정을 만들고, 쉽게 관리하세요.</SubTitle>
          <ButtonContainer>
            <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
            <StartButton onClick={handleStartClick}>시작하기</StartButton>
          </ButtonContainer>
        </TextWrapper>
        <MockupImage src={mockSVG} alt="목업 이미지" />
      </ContentWrapper>
      <BackgroundCircle src={circleSVG} alt="배경 원" />
    </LandingContainer>
  );
};

export default LandingPage;

// 스타일 정의
const LandingContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start; /* 콘텐츠를 가운데 정렬 */
  align-items: center;
  background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  width: 100%;
  padding-left: 0px;
  z-index: 1;
  position: relative;
`;

const BackgroundCircle = styled.img`
  position: absolute;
  left: -350px; /* 화면 가장자리와 붙음 */
  bottom: 0px; /* 하단 가장자리와 붙음 */
  width: 400px; /* 원의 크기 조정 */
  height: 800px;
  z-index: 0; /* 텍스트 뒤로 보내기 */
  opacity: 0.5;
`;

const TextWrapper = styled.div`
  max-width: 600px;
  margin-right: 20px;
  margin-left: -150px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const SubTitle = styled.p`
  font-size: 24px;
  color: #666;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
`;

const LoginButton = styled(Button)`
  background-color: #39a7f7;
`;

const StartButton = styled(Button)`
  background-color: #007aff;
`;

const MockupImage = styled.img`
  width: 500px;
`;
