/** @jsxImportSource @emotion/react */
import React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Mic, Calendar, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import Button from "@/components/common/Button/Button";
import kakao_symbol from "@/assets/kakao_symbol.svg";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import step1SVG from "@/assets/step1.svg"
import step2SVG from "@/assets/step2.svg"
import step3SVG from "@/assets/step3.svg"

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4fa, white);
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
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const TextSection = styled.div`
  flex: 1;
  margin-bottom: 3rem;

  @media (min-width: 1024px) {
    margin-bottom: 0;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  color: #39A7F7;
  margin-bottom: 1rem;
`

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #39A7F7;
  margin-bottom: 1.5rem;
`

const Description = styled(motion.p)`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;

  span {
    color: #39A7F7;
  }
`

const AnimationContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  margin-left: auto;
  
  overflow: visible;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

//////////////////////////////////////////
const AnimationGroup = styled.div`
  position: fixed;
  top: 50%;
  left: 10%; 
  width: 34rem; 
  height: 34rem;
  z-index: 0.1;  
`;

const BackgroundCircle = styled(motion.div)`
  width: 30rem;
  height: 30rem;
  background-color: #39a7f7;
  border-radius: 50%;
  position: absolute;
  opacity: 0.1;
  top: -50%;
  left: -40%;
`;
const OrbitContainer = styled(motion.div)`
  position: absolute;
  width: 34rem;
  height: 34rem;
  transform: translate(-50%, -50%);
  top: -50%;
  left: -40%;
`;

const OrbitingCircle = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #39a7f7;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, 0);
  z-index: 1;
`;

const PlanetRing = styled(motion.div)`
  width: 34rem;
  height: 34rem;
  border: 2px solid #39a7f7;
  border-radius: 50%;
  position: absolute;
  z-index: 0;
  opacity: 0.2;
  top: -56%;
  left: -46%;
`;
/////////////////////////////////////////////
const StepSVG = styled.img`
  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
`

const Card = styled(motion.div)`
  width: 70%;
  position: relative;
  z-index: 10;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureItem = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
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
`;

const FeatureDescription = styled.p`
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 1rem;
  min-height: 48px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 10rem;
  background-color: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af; /* text-gray-400 */
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

const SectionContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
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
  }

  p {
    color: #4a5568;
    margin-bottom: 1rem;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 16rem;
  background-color: #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 50%;
  }

  span {
    color: #a0aec0;
  }
`;

const ButtonWrapper = styled.div`
  gap: 16px;
  display: flex;
  @media (max-width: 1023px) {
    justify-content: center;
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
      <NavBar>
        <Logo>
          <img src={logo} alt="" />
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
      <BackgroundCircle/>
  <PlanetRing/>
  <OrbitContainer>
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
                <StepSVG src={index === 0 ? step1SVG : index === 1 ? step2SVG : step3SVG} alt={`Step ${index + 1}`} />
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
              <SectionContent style={{ marginRight: "2rem" }}>
                <h2>팀플랜으로 협업 효율 극대화</h2>
                <p>
                  팀원들과 실시간으로 일정을 공유하고 조율하세요. AI가 최적의 팀
                  일정을 제안해 드립니다.
                </p>
              </SectionContent>
              <ImageContainer>
                <span>팀플랜 이미지</span>
              </ImageContainer>
            </SectionContainer>
          </Section>

          <Section
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SectionContainer>
              <SectionContent>
                <h2>소셜 플래닝</h2>
                <p>원하는 회원과 친구를 맺고 일정을 공유해보세요.</p>
              </SectionContent>
              <ImageContainer>
                <span>소셜 플래닝 이미지</span>
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
