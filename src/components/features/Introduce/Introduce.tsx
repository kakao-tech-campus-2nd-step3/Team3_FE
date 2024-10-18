import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import circleSVG from "@/assets/circle (1).svg"; // 원형 이미지
import mockSVG from "@/assets/mock2.svg"; // 목업 이미지
import effectSVG from "@/assets/effect.svg";
import kakao from "@/assets/Login.svg";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";

const LandingContainer = styled.div`
  width: 1440px;
  left: 0;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  position: relative;
  margin: 0 auto;
  margin-top: 150px;
`;

const BackgroundCircle = styled.img`
  position: absolute;
  left: 0px;
  width: 400px;
  z-index: 0;
  opacity: 0.5;
  bottom: -110px;
  margin-bottom: 115px;
`;

const TextWrapper = styled.div`
  max-width: 600px;
  margin-left: 150px;
  margin-top: 100px;
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
  margin-left: -100px;
  margin-top: -60px;
  ${breakpoints.tablet} {
    justify-content: flex-start;
  }
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
  margin-left: -80px;
`;

const HighlightText = styled.span`
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
  position: absolute;
  bottom: 250px;
  z-index: 1;
  margin-left: 80px;
  bottom: 200px;
  ${breakpoints.tablet} {
    justify-content: flex-start;
  }
`;

const KakaoLoginButton = styled.img`
  cursor: pointer;
  width: 200px;
`;

const MockupImage = styled.img`
  width: 700px;
  margin-top: -190px;
  margin-left: 600px;
`;
const Introduce = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/plan/preview");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <LandingContainer>
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
        <MockupImage src={mockSVG} alt="목업 이미지" />
        <BackgroundCircle src={circleSVG} alt="배경 원" />
      </TextWrapper>

      <ButtonContainer>
        <KakaoLoginButton
          src={kakao}
          alt="카카오 로그인"
          onClick={handleLoginClick}
        />
        <Button onClick={handleStartClick}>로그인 없이 시작하기</Button>
      </ButtonContainer>
    </LandingContainer>
  );
};

export default Introduce;
