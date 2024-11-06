import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import useCreatePlan from "@/api/hooks/useCreatePlans";
import CircleButton from "@/components/common/CircleButton/CircleButton";
import breakpoints from "@/variants/breakpoints";

// 캘린더와 버튼을 포함하는 반응형 컨테이너
const CalendarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px; // 최대 너비를 설정해 버튼이 중앙을 유지하도록 합니다.
  margin: 0 auto;
  padding: 20px;
`;

// 버튼을 캘린더 컨테이너 내의 상대적인 위치에 두도록 설정
const ButtonWrapper = styled.div`
  position: absolute;
  top: 10%;
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  left: calc(10% + 10px);
  z-index: 1;

  ${breakpoints.tablet} {
    top: 10%;
    left: 20px;
  }

  ${breakpoints.mobile} {
    top: 10%;
    left: 20px;
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px 30px 20;
  width: 500px; // 가로폭 설정
  max-width: 95%;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px; /* 각 입력 필드 사이에 간격 추가 */
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 99%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  background-color: #39a7f7;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
`;

const ToggleWrapper = styled.label`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  gap: 10px;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 20px;
  position: relative;
  outline: none;
  transition: background 0.3s;

  &:checked {
    background: #39a7f7;
  }

  &:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    top: 1px;
    left: 1px;
    transition: transform 0.3s;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

const ToggleLabel = styled.span`
  font-size: 16px;
  color: #333;
`;

const MainPage: React.FC = () => {
  const { data: plans, isLoading, error } = useGetPlans();
  const [modalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAccessible, setIsAccessible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // useCreatePlan 훅 사용
  const createPlanMutation = useCreatePlan();

  const handleToggleChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setter((prev) => !prev);
    };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlanMutation.mutate({
      title,
      description,
      startTimestamp: Math.floor(new Date(startDate).getTime() / 1000),
      endTimestamp: Math.floor(new Date(endDate).getTime() / 1000),
      accessibility: isAccessible,
      isCompleted,
    });
    setIsModalOpen(false); // 폼 제출 후 모달 닫기
  };

  useEffect(() => {
    // 로컬 스토리지 정리 (필요한 경우)
    const savedPreviewData = localStorage.getItem("previewPlanData");
    if (savedPreviewData) {
      localStorage.removeItem("previewPlanData");
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 처리
  }

  if (error) {
    return <div>Error: {error.message}</div>; // 에러 처리
  }

  return (
    <CalendarContainer>
      <ButtonWrapper>
        <CircleButton onClick={handleButtonClick}>+</CircleButton>
      </ButtonWrapper>
      <CustomCalendar isPreviewMode={false} plans={plans || []} />

      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>새 일정 추가</h3>
            <form onSubmit={handleSubmit}>
              <span>제목</span>
              <Input
                type="text"
                name="title"
                aria-label="제목"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <span>설명</span>
              <Textarea
                name="description"
                aria-label="설명"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <span>시작 날짜</span>
              <Input
                type="datetime-local"
                name="startDate"
                aria-label="시작 날짜"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <span>종료 날짜</span>
              <Input
                type="datetime-local"
                name="endDate"
                aria-label="종료 날짜"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <ToggleWrapper>
                <ToggleLabel>공개 여부</ToggleLabel>
                <ToggleInput
                  type="checkbox"
                  checked={isAccessible}
                  onChange={handleToggleChange(setIsAccessible)}
                />
              </ToggleWrapper>

              {/* 완료 여부 토글 */}
              <ToggleWrapper>
                <ToggleLabel>완료 여부</ToggleLabel>
                <ToggleInput
                  type="checkbox"
                  checked={isCompleted}
                  onChange={handleToggleChange(setIsCompleted)}
                />
              </ToggleWrapper>

              <CloseButton type="submit">저장</CloseButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </CalendarContainer>
  );
};
export default MainPage;
