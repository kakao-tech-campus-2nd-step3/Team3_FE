import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import circleSVG from "@/assets/circle (1).svg"; // 원형 이미지
import mockSVG from "@/assets/mock2.svg"; // 목업 이미지
import effectSVG from "@/assets/effect.svg";
import kakao from "@/assets/Login.svg";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";

const LandingContainer = styled.div`
  max-width: 1280px;
  padding: 140px 40px 90px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${breakpoints.tablet} {
    padding: 140px 40px 60px;
    flex-direction: column;
    align-items: center;
  }
`;

const BackgroundCircle = styled.img`
  display: block;
  position: absolute;
  left: -100px;
  width: 400px;
  z-index: -1;
  opacity: 0.5;
  ${breakpoints.tablet} {
    display: none;
  }
`;

const TextWrapper = styled.div`
  width: 45%;
  max-width: 500px;
  text-align: left;
  margin-bottom: 0;
  margin-right: 5%;

  ${breakpoints.tablet} {
    width: 100%;
    text-align: center;
    margin-bottom: 40px;
  }
`;

const TitleWithImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;

  ${breakpoints.tablet} {
    justify-content: center;
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
}`;

const EffectImage = styled.img`
width: clamp(30px, 5vw, 50px);
height: auto;
margin-left: 10px;
}`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin-top: 20px;

  ${breakpoints.tablet} {
    justify-content: center;
  }
`;

const KakaoLoginButton = styled.img`
  cursor: pointer;
  width: 200px;

  ${breakpoints.tablet} {
    width: 160px;
  }
`;

const MockupImageWrapper = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 150px;
  max-width: 500px;
  ${breakpoints.tablet} {
    max-width: 100%;
    justify-content: center;
    padding-top: 50px;
  }
`;
const MockupImage = styled.img`
  max-width: 450px;
  height: auto;
  object-fit: contain;
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
        <ButtonContainer>
          <KakaoLoginButton
            src={kakao}
            alt="카카오 로그인"
            onClick={handleLoginClick}
          />
          <Button onClick={handleStartClick}>시작하기</Button>
        </ButtonContainer>
      </TextWrapper>
      <MockupImageWrapper>
        <MockupImage src={mockSVG} alt="목업 이미지" />
      </MockupImageWrapper>
      <BackgroundCircle src={circleSVG} alt="배경 원" />
    </LandingContainer>
  );
};

export default Introduce;
