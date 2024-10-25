import { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";

// 전체 컨테이너
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
  gap: 20px;
`;

// 캘린더 섹션
const CalendarContainer = styled.div`
  width: 100%;
`;

// 버튼 섹션 (캘린더 위에 배치)
const ButtonSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px; // 캘린더와의 간격 조절
`;

// 타이틀
const StyledText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

// 하단 버튼 섹션
const FooterButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 130px;
`;

const PlanSelectPage = () => {
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleNumberButtonClick = (number: number) => {
    setClickedNumber(number);
  };

  return (
    <PageContainer>
      {/* 플랜 선택 텍스트 */}
      <StyledText>원하는 플랜을 선택하세요</StyledText>

      {/* 번호 버튼 */}
      <ButtonSection>
        <NumberButton
          number={1}
          clicked={clickedNumber === 1}
          onClick={() => handleNumberButtonClick(1)}
        />
        <NumberButton
          number={2}
          clicked={clickedNumber === 2}
          onClick={() => handleNumberButtonClick(2)}
        />
        <NumberButton
          number={3}
          clicked={clickedNumber === 3}
          onClick={() => handleNumberButtonClick(3)}
        />
      </ButtonSection>

      {/* 캘린더 영역 */}

      <CalendarContainer>
        <CustomCalendar />
      </CalendarContainer>

      {/* 하단 버튼 영역 */}
      <FooterButtonSection>
        <Button
          onClick={() => {
            if (clickedNumber !== null) {
              navigate("/plan/update"); // 임시 페이지로 이동
            }
          }}
        >
          확인
        </Button>
        <Button theme="secondary" onClick={() => navigate(-1)}>
          취소
        </Button>
      </FooterButtonSection>
    </PageContainer>
  );
};

export default PlanSelectPage;
