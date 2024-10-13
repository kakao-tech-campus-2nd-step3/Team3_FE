import styled from "@emotion/styled";
import step1SVG from "../../../assets/step1.svg";
import step2SVG from "../../../assets/step2.svg";
import step3SVG from "../../../assets/step3.svg";

const HowToUseContainer = styled.div`
  width: 100%;
  height: auto;
  text-align: center;
  left: 0;
  right: 0
  margin: 0 auto;
  margin-top: 890px;
  position: absolute;
`;

const TextWrapper = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 중앙으로 보정
  margin-bottom: -60px;
  margin-top: 120px;
`;

const HowToUseTitle = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #39a7f7;
  margin-bottom: -30px;
`;

const HowToUseDescription = styled.p`
  font-size: 45px;
  font-weight: bold;
  color: #333;
  margin-bottom: -30px;
`;
const HighlightText = styled.p`
  color: #39a7f7;
  display: inline;
`;
const AddtionalDescription = styled.p`
  font-size: 32px;
  font-weight: bold;
`;
const StepContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
`;
const Step = styled.div`
  flex: 1;
  flex-direction: column;
`;
const StepImage = styled.img`
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  display: block;
`;

const HowToUse: React.FC = () => {
  return (
    <HowToUseContainer>
      <TextWrapper>
        <HowToUseTitle>어떻게 사용하나요?</HowToUseTitle>
        <HowToUseDescription>
          <HighlightText>말만 하세요,</HighlightText>당신의 플랜을
          책임져드립니다.
        </HowToUseDescription>
        <AddtionalDescription>
          빠르게 일정을 만들고, 쉽게 관리해보세요.
        </AddtionalDescription>
      </TextWrapper>
      <StepContainer>
        <Step>
          <StepImage src={step1SVG} alt="1단계 이미지" />
        </Step>
        <Step>
          <StepImage src={step2SVG} alt="2단계 이미지" />
        </Step>
        <Step>
          <StepImage src={step3SVG} alt="3단계 이미지" />
        </Step>
      </StepContainer>
    </HowToUseContainer>
  );
};

export default HowToUse;
