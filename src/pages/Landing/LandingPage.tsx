import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import circleSVG from "@/assets/circle (1).svg"; // 원형 이미지
import mockSVG from "@/assets/mock2.svg"; // 목업 이미지
import effectSVG from "@/assets/effect.svg";
import logoSVG from "@/assets/logo.svg";
import HowToUse from "@/components/features/HowToUse/HowToUse";
import Button from "@/components/common/Button/Button";

// 스타일 정의
const NavBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 100;
`;

const Logo = styled.img`
  height: 70px;
`;
const NaviBarLink = styled.div`
  display: flex;
  gap: 20px;
`;
const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    color: #39a7f7;
  }
`;

const LandingContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  position: relative;
  margin: 0 auto;
`;

const BackgroundCircle = styled.img`
  position: absolute;
  left: -360px;
  bottom: -100px;
  width: 400px;
  height: auto;
  z-index: 0;
  opacity: 0.5;
`;

const TextWrapper = styled.div`
  max-width: 600px;
  margin-right: 20px;
  margin-left: -150px;
  margin-top: -200px;
`;

const TitleWithImage = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-left: -100px;
  margin-top: -60px;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: #39a7f7;
  margin-bottom: 0px;
`;

const SubTitle = styled.p`
  font-size: 66px;
  font-weight: bold;
  color: #39a7f7;
  margin-top: -20px;
  margin-bottom: 0px;
  margin-left: -70px;
`;

const AdditionalText = styled.p`
  font-size: 40px;
  font-weight: bold;
  color: #3f3f3f;
  margin-top: 20px;
  margin-bottom: 40px;
  margin-left: -80px;
`;

const HighlightText = styled.p`
  color: #39a7f7;
  display: inline;
`;

const EffectImage = styled.img`
width: 50px,
height: 63px;
margin-left: 10px
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const MockupImage = styled.img`
  width: 700px;
  margin-top: 50px;
  margin-left: -50px;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/plan/preview");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <NavBar>
        <Logo src={logoSVG} alt="로고" />
        <NaviBarLink>
          <NavLink href="#introduce">소개</NavLink>
          <NavLink href="#pricing">사용 방법</NavLink>
          <NavLink href="#subscribe">구독하기</NavLink>
          <NavLink href="#free-trial">무료 체험</NavLink>
        </NaviBarLink>
      </NavBar>

      <LandingContainer>
        <ContentWrapper>
          <TextWrapper>
            <TitleWithImage>
              <Title>간편하고 빠른 플랜 생성</Title>
              <EffectImage src={effectSVG} alt="효과 이미지" />
            </TitleWithImage>
            <SubTitle>Speak, and Plan it!</SubTitle>
            <AdditionalText>
              <HighlightText>내 목소리</HighlightText>로 일정을 만들고, <br />
              쉽게 관리해보세요!
            </AdditionalText>
            <ButtonContainer>
              <Button onClick={handleLoginClick}>로그인</Button>
              <Button onClick={handleStartClick}>시작하기</Button>
            </ButtonContainer>
          </TextWrapper>
          <MockupImage src={mockSVG} alt="목업 이미지" />
          <BackgroundCircle src={circleSVG} alt="배경 원" />
        </ContentWrapper>
      </LandingContainer>
      <HowToUse />
    </>
  );
};

export default LandingPage;
