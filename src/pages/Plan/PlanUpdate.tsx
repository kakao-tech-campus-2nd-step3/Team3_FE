import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";
import RouterPath from "@/router/RouterPath";
import useSavePreviewPlan from "@/api/hooks/useSavePreviewPlan";

// 슬라이드 애니메이션
const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
const PlanUpdateContainer = styled.div`
  display: grid;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const CalendarContainer = styled.div`
  margin-bottom: 40px;
  ${breakpoints.mobile} {
    margin-bottom: -50px;
  }
`;
const StyledText = styled.p`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  &.animate {
    animation: ${slideDown} 1s ease-in-out;
  }
  ${breakpoints.mobile} {
    font-size: 18px;
    white-space: pre-line;
  }
`;
const StyledTextContainer = styled.div`
  height: 70px;
  margin-bottom: 20px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 130px;
  margin-bottom: 30px;
  ${breakpoints.mobile} {
    gap: 30px;
  }
`;
const PlanUpdate = () => {
  const TitleMessages = [
    "플랜을 수정하거나, 바로 저장하세요.",
    "일정을 옮기고 크기를 조정하여\n원하는대로 플랜을 수정해보세요",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === TitleMessages.length - 1 ? 0 : prevIndex + 1,
      );
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan || [];
  const previewDeviceId = location.state?.deviceId;
  const previewGroupId = location.state?.groupId;

  const { mutate: savePreviewPlan } = useSavePreviewPlan();

  const handleSave = async () => {
    try {
      if (!selectedPlan || selectedPlan.length === 0) {
        alert("저장할 플랜이 없습니다.");
        return;
      }

      if (!previewDeviceId || !previewGroupId) {
        alert("디바이스 ID 또는 그룹 ID가 없습니다.");
        return;
      }

      savePreviewPlan({
        deviceId: previewDeviceId,
        groupId: previewGroupId,
        planDataList: selectedPlan,
      });
    } catch (error) {
      console.error("플랜 저장 중 오류 발생:", error);
      alert("플랜 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <PlanUpdateContainer>
      <ContentWrapper>
        <StyledTextContainer>
          <StyledText className={animate ? "animate" : ""}>
            {TitleMessages[currentMessageIndex]}
          </StyledText>
        </StyledTextContainer>

        <CalendarContainer>
          <CustomCalendar
            plans={selectedPlan}
            isPreviewMode
            previewDeviceId={previewDeviceId}
            previewGroupId={previewGroupId}
          />
        </CalendarContainer>
        <ButtonContainer>
          <Button onClick={handleSave}>저장</Button>
          <Button theme="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </ButtonContainer>
      </ContentWrapper>
    </PlanUpdateContainer>
  );
};
export default PlanUpdate;
