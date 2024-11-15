/** @jsxImportSource @emotion/react */
import React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Mic, Calendar, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Global, css } from "@emotion/react";
import logo from "@/assets/logo.svg";
import Button from "@/components/common/Button/Button";
import kakao_symbol from "@/assets/kakao_symbol.svg";
import RouterPath from "@/router/RouterPath";
import teamplan2 from "@/assets/teamplan2.png";
import friends from "@/assets/friends.png";
import step1GIF from "@/assets/making.gif";
import step2GIF from "@/assets/selecting.gif";
import step3GIF from "@/assets/dragging.gif";

const GlobalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4fa, white);
  overflow-x: hidden;
`;

const NavBar = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #39a7f7;

  img {
    width: 150px;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
  }
`;

const TextSection = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  z-index: 10;
  text-align: center;

  @media (min-width: 1024px) {
    margin-bottom: 0;
    text-align: left;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  color: #39a7f7;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #39a7f7;
  margin-bottom: 1.5rem;
`;

const Description = styled(motion.p)`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;

  span {
    color: #39a7f7;
  }
`;

const AnimationContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  margin-left: auto;
  overflow-x: hidden;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  @media (min-width: 1024px) {
    justify-content: flex-end;
  }
`;

/* AnimationGroup 및 자식 요소들 */
const AnimationGroup = styled.div`
  position: fixed;
  top: 15%;
  left: -15%;
  width: 34rem;
  height: 34rem;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  @media (max-width: 768px) {
    display: none;
  }
`;

const BackgroundCircle = styled(motion.div)`
  width: 30rem;
  height: 30rem;
  background-color: #39a7f7;
  border-radius: 50%;
  position: absolute;
  opacity: 0.1;
`;

const OrbitContainer = styled(motion.div)`
  position: absolute;
  width: 25rem;
  height: 25rem;
  transform: translate(-50%, -50%);
`;

const OrbitingCircle = styled.div`
  opacity: 0.5;
  width: 2rem;
  height: 2rem;
  background-color: #39a7f7;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, 0);
`;

const PlanetRing = styled(motion.div)`
  width: 34rem;
  height: 34rem;
  border: 2px solid #39a7f7;
  border-radius: 50%;
  position: absolute;
  opacity: 0.2;
`;

const StepSVG = styled.img`
  width: 100%;
  max-width: 20rem;
  height: auto;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 10;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  justify-content: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  text-align: center;
  @media (min-width: 768px) {
    width: 100%;
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  padding: 0 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 0;
  }

  box-sizing: border-box;
`;

const FeatureItem = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  h3,
  p {
    word-wrap: break-word;
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  color: #39a7f7;
  margin: 0 auto 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  min-height: 60px;
  word-wrap: break-word;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FeatureDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
  min-height: 48px;
  word-wrap: break-word;
`;

const Footer = styled.footer`
  background-color: #f3f4f6; /* bg-gray-100 */
  padding: 2rem 0;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const FooterFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FooterSection = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    width: 24%;
    margin-bottom: 0;
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FooterCopy = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #4b5563; /* text-gray-600 */
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionContainer = styled.div<{ reverse?: boolean }>`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
    padding: 2rem;
  }
`;

const SectionContent = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    width: 50%;
    margin-bottom: 0;
  }

  h2 {
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    @media (min-width: 768px) {
      font-size: 2rem;
      text-align: left;
    }
  }

  p {
    color: #4a5568;
    margin-bottom: 1rem;
    text-align: center;

    @media (min-width: 768px) {
      text-align: left;
    }
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 12rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: #a0aec0;
  }
  overflow: hidden;
  @media (min-width: 768px) {
    width: 50%;
    height: 16rem;
    overflow: hidden;
  }
`;

const ImageContainer2 = styled.div`
  width: 100%;
  height: 12rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  span {
    color: #a0aec0;
  }

  @media (min-width: 768px) {
    width: 50%;
    height: 16rem;
    padding: 40px;
    overflow: hidden;
  }
`;

const ButtonWrapper = styled.div`
  gap: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (min-width: 1023px) {
    justify-content: flex-start;
  }
`;

const SymbolImage = styled.img`
  width: 20px;
  height: 20px;
  padding-right: 3px;
`;

const LandingPage: React.FC = () => {
  const loginUrl = import.meta.env.VITE_LOGIN_URL;
  const navigate = useNavigate();

  const handleLoginClick = () => {
    window.location.href = loginUrl;
  };

  const handleStartClick = () => {
    navigate(RouterPath.PREVIEW_PLAN);
  };

  const steps = [
    {
      title: "음성으로 일정 말하기",
      description: "마이크 버튼을 누르고 일정을 말하세요.",
      icon: Mic,
    },
    {
      title: "AI가 일정 최적화",
      description: "AI가 당신의 일정을 분석하고 최적화합니다.",
      icon: Star,
    },
    {
      title: "일정 확인 및 관리",
      description: "생성된 일정을 확인하고 필요시 수정하세요.",
      icon: Calendar,
    },
  ];

  return (
    <PageContainer>
      <Global styles={GlobalStyles} />
      <NavBar>
        <Logo>
          <img src={logo} alt="Logo" />
        </Logo>
      </NavBar>

      <MainContent>
        <FlexContainer>
          <TextSection>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              간편하고 빠른 플랜생성
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Speak and plan it!
            </Subtitle>
            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span>내 목소리</span>로 일정을 만들고 쉽게 관리해보세요!
            </Description>
            <ButtonWrapper>
              <Button theme="kakao" size="long" onClick={handleLoginClick}>
                <SymbolImage src={kakao_symbol} alt="Login" />
                카카오 로그인
              </Button>
              <Button onClick={handleStartClick} size="long">
                체험해보기
              </Button>
            </ButtonWrapper>
          </TextSection>

          <AnimationGroup>
            <BackgroundCircle
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <PlanetRing
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <OrbitContainer
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              animate={{ rotate: 360 }}
            >
              <OrbitingCircle />
            </OrbitContainer>
          </AnimationGroup>

          <AnimationContainer>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <Mic
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "#39A7F7",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  음성으로 일정 생성
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <Calendar
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "#39A7F7",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  AI가 최적화된 일정 제안
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Clock
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "#39A7F7",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  효율적인 시간 관리
                </div>
              </div>
            </Card>
          </AnimationContainer>
        </FlexContainer>

        <motion.section
          style={{ marginBottom: "5rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>Splanet 사용법</SectionTitle>
          <GridContainer>
            {steps.map((step, index) => (
              <FeatureItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureIcon as={step.icon} />
                <FeatureTitle>{step.title}</FeatureTitle>
                <FeatureDescription>{step.description}</FeatureDescription>
                <StepSVG
                  src={
                    index === 0 ? step1GIF : index === 1 ? step2GIF : step3GIF
                  }
                  alt={`Step ${index + 1}`}
                />
              </FeatureItem>
            ))}
          </GridContainer>
        </motion.section>

        <motion.section
          style={{ marginBottom: "5rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Section
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SectionContainer>
              <SectionContent>
                <h2>팀플랜으로 협업 효율 극대화</h2>
                <p>
                  팀원들과 실시간으로 일정을 공유하고 조율하세요. AI가 최적의 팀
                  일정을 제안해 드립니다.
                </p>
              </SectionContent>
              <ImageContainer2>
                <img
                  src={teamplan2}
                  alt="팀플랜 이미지"
                  style={{
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    width: "100%",
                    height: "auto",
                    borderRadius: "0.5rem",
                  }}
                />
              </ImageContainer2>
            </SectionContainer>
          </Section>

          <Section
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SectionContainer reverse>
              <SectionContent>
                <h2>소셜 플래닝</h2>
                <p>원하는 회원과 친구를 맺고 일정을 공유해보세요.</p>
              </SectionContent>
              <ImageContainer>
                <img
                  src={friends}
                  alt="소셜 플래닝 이미지"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                  }}
                />
              </ImageContainer>
            </SectionContainer>
          </Section>
        </motion.section>
      </MainContent>

      <Footer>
        <FooterContainer>
          <FooterFlex>
            <FooterSection>
              <FooterTitle>Splanet</FooterTitle>
              <p style={{ color: "#4b5563" }}>당신의 일정을 더 스마트하게</p>
            </FooterSection>
          </FooterFlex>
          <FooterCopy>
            <p>&copy; 2024 Splanet. All rights reserved.</p>
          </FooterCopy>
        </FooterContainer>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;
