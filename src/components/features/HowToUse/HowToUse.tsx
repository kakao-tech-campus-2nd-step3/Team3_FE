import styled from "@emotion/styled";

import step1SVG from "../../../assets/step1.svg";
import step2SVG from "../../../assets/step2.svg";
import step3SVG from "../../../assets/step3.svg";
import breakpoints from "@/variants/breakpoints";

const HowToUseContainer = styled.div`
  padding: 0 20px;
  margin-top: 60px;
`;

const TextWrapper = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const HowToUseTitle = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #39a7f7;
  margin: 0;
  padding: 0;

  ${breakpoints.tablet} {
    font-size: clamp(24px, 3vw, 48px);
  }
`;

const HowToUseDescription = styled.p`
  font-size: 45px;
  font-weight: bold;
  color: #333;
  margin: 0;
  padding: 0;
  margin-top: 20px;

  ${breakpoints.tablet} {
    font-size: clamp(20px, 4vw, 40px);
  }
`;

const HighlightText = styled.p`
  color: #39a7f7;
  display: inline;
`;

const AddtionalDescription = styled.p`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  padding: 0;

  ${breakpoints.tablet} {
    font-size: clamp(18px, 3vw, 30px);
  }
`;

const StepContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
  padding: 0 30px;
  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const StepImage = styled.img`
  max-width: calc(100% / 3);
  ${breakpoints.mobile} {
    max-width: 100%;
  }
`;

const HowToUse: React.FC = () => {
  return (
    <HowToUseContainer>
      <TextWrapper>
        <HowToUseTitle>어떻게 사용하나요?</HowToUseTitle>
        <HowToUseDescription>
          <HighlightText>말만 하세요,</HighlightText>
          당신의 플랜을 책임져드립니다.
        </HowToUseDescription>
        <AddtionalDescription>
          빠르게 일정을 만들고, 쉽게 관리해보세요.
        </AddtionalDescription>
      </TextWrapper>
      <StepContainer>
        <StepImage src={step1SVG} alt="1단계 이미지" />
        <StepImage src={step2SVG} alt="2단계 이미지" />
        <StepImage src={step3SVG} alt="3단계 이미지" />
      </StepContainer>
    </HowToUseContainer>
  );
};

export default HowToUse;
