import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import useCreatePlan from "@/api/hooks/useCreatePlans";
import useDeletePlan from "@/api/hooks/useDeletePlans";
import CircleButton from "@/components/common/CircleButton/CircleButton";
import breakpoints from "@/variants/breakpoints";
import useUpdatePlan from "@/api/hooks/useUpdatePlan";

// 스타일드 컴포넌트 정의
const CalendarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

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
  padding: 20px 30px;
  width: 500px;
  max-width: 95%;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
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

const usePlanData = (initialSavedPlan: any) => {
  const { data: plans, isLoading, error } = useGetPlans();
  const createPlanMutation = useCreatePlan();
  const deletePlanMutation = useDeletePlan();
  const updatePlanMutation = useUpdatePlan();
  const [savedPlan, setSavedPlan] = useState(initialSavedPlan || []);

  useEffect(() => {
    if (Array.isArray(initialSavedPlan)) {
      setSavedPlan(initialSavedPlan);
    }
  }, [initialSavedPlan]);

  const combinedPlans = [...(plans || []), ...savedPlan];

  const createPlan = (newPlan: any) => {
    createPlanMutation.mutate(newPlan);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlanMutation.mutate(Number(planId));
  };

  const handleUpdatePlan = (planId: string, updatedPlanData: any) => {
    updatePlanMutation.mutate({
      planId: Number(planId),
      planData: updatedPlanData,
    });
  };

  return {
    plans: combinedPlans,
    isLoading,
    error,
    createPlan,
    handleDeletePlan,
    handleUpdatePlan,
  };
};

// MainPage 컴포넌트
const MainPage: React.FC = () => {
  const location = useLocation();
  const {
    plans,
    isLoading,
    error,
    createPlan,
    handleDeletePlan,
    handleUpdatePlan,
  } = usePlanData(location.state?.savedPlan);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAccessible, setIsAccessible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlan({
      id: Date.now().toString(),
      title,
      description,
      startDate,
      endDate,
      accessibility: isAccessible,
      isCompleted,
    });
    closeModal();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CalendarContainer>
      <ButtonWrapper>
        <CircleButton onClick={openModal}>+</CircleButton>
      </ButtonWrapper>
      <CustomCalendar
        plans={plans}
        onDeletePlan={handleDeletePlan}
        // onUpdatePlan={handleUpdatePlan}
      />

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
                  onChange={() => setIsAccessible(!isAccessible)}
                />
              </ToggleWrapper>
              <ToggleWrapper>
                <ToggleLabel>완료 여부</ToggleLabel>
                <ToggleInput
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => setIsCompleted(!isCompleted)}
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
