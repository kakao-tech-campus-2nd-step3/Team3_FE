import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import breakpoints from "@/variants/variants";
import circleSVG from "@/assets/circle (1).svg";
import mockSVG from "@/assets/mock2.svg";
import effectSVG from "@/assets/effect.svg";
import logoSVG from "@/assets/logo.svg";
import HowToUse from "@/components/features/HowToUse/HowToUse";
import Button from "@/components/common/Button/Button";

// 스타일 정의
export const NavBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 100;

  ${breakpoints.tablet} {
    height: 120px;
    padding: 0 40px;
  }
`;

const Logo = styled.img`
  height: 50px;

  ${breakpoints.tablet} {
    height: 70px;
  }
`;

const NaviBarLink = styled.div`
  display: flex;
  gap: 10px;

  ${breakpoints.tablet} {
    gap: 20px;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: clamp(12px, 2vw, 15px); 
  cursor: pointer;
  font-weight: 600;

  &:hover {
    color: #39a7f7;
  }
`;

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px 0px 40px;
  overflow-x: hidden;
  ${breakpoints.tablet} {
    padding: 140px 40px 60px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  ${breakpoints.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const BackgroundCircle = styled.img`
  display: none;

  ${breakpoints.tablet} {
    display: block;
    position: absolute;
    left: -200px;
    bottom: -100px;
    width: 400px;
    z-index: -1;
    opacity: 0.5;
  }
`;

const TextWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
  margin-bottom: 40px;

  ${breakpoints.tablet} {
    width: 45%;
    text-align: left;
    margin-bottom: 0;
    margin-right: 5%;
  }
`;

const TitleWithImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  ${breakpoints.tablet} {
    justify-content: flex-start;
  }
`;

const Title = styled.h1`
  font-size: clamp(28px, 5vw, 48px);
  font-weight: bold;
  color: #39a7f7;
  white-space: nowrap;
`;

const SubTitle = styled.p`
  font-size: clamp(24px, 4vw, 40px);
  font-weight: bold;
  color: #39a7f7;
  margin-top: 10px;
`;

const AdditionalText = styled.p`
  font-size: clamp(18px, 3vw, 30px);
  font-weight: bold;
  color: #3f3f3f;
  margin-top: 20px;
`;

const HighlightText = styled.span`
  color: #39a7f7;
`;

const EffectImage = styled.img`
  width: clamp(30px, 5vw, 50px);
  height: auto;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;

  ${breakpoints.tablet} {
    justify-content: flex-start;
  }
`;

const MockupImageWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${breakpoints.tablet} {
    width: 50%;
    justify-content: flex-end;
    padding-top: 150px;
  }
`;

const MockupImage = styled.img`
  width: 100%;
  max-width: 450px;
  height: auto;
  object-fit: contain;
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
              <HighlightText>내 목소리</HighlightText>로 일정을 만들고,
              <br /> 쉽게 관리해보세요!
            </AdditionalText>
            <ButtonContainer>
              <Button onClick={handleLoginClick}>로그인</Button>
              <Button onClick={handleStartClick}>시작하기</Button>
            </ButtonContainer>
          </TextWrapper>
          <MockupImageWrapper>
            <MockupImage src={mockSVG} alt="목업 이미지" />
          </MockupImageWrapper>
          <BackgroundCircle src={circleSVG} alt="배경 원" />
        </ContentWrapper>
      </LandingContainer>
      <HowToUse />
    </>
  );
};

export default LandingPage;
