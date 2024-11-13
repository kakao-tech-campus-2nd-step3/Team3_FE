import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDatePicker from "@/components/features/DatePicker/DatePicker";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import { apiClient } from "@/api/instance";
import useCreatePlan from "@/api/hooks/useCreatePlan";
import useDeletePlan from "@/api/hooks/useDeletePlan";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";
import RouterPath from "@/router/RouterPath";

const ModalContainer = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #39a7f7;
    box-shadow: 0 0 0 2px #338bd0;
  }
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

export default function PlanModifyPage() {
  const location = useLocation();
  const { plans = [], teamName } = location.state || {};
  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>(plans);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [descriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedDescription] = useState("");

  const [newPlanData, setNewPlanData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    accessibility: true,
    isCompleted: false,
  });
  const navigate = useNavigate();
  const [pendingPlans, setPendingPlans] = useState(false);
  const { mutate: createPlan } = useCreatePlan();
  const { mutate: deletePlan } = useDeletePlan();

  const handleAddPlan = () => setIsAddModalOpen(true);

  const handleAddPlanSubmit = () => {
    const {
      title,
      description,
      startDate,
      endDate,
      accessibility,
      isCompleted,
    } = newPlanData;
    const utcStartDate = new Date(`${startDate}Z`).toISOString();
    const utcEndDate = new Date(`${endDate}Z`).toISOString();

    createPlan(
      {
        plan: {
          title,
          description,
          startDate: utcStartDate,
          endDate: utcEndDate,
          accessibility,
          isCompleted,
        },
      },
      {
        onSuccess: (response) => {
          const newPlanId = response.data.id;
          alert("플랜이 추가되었습니다.");
          setModifiedPlans([
            ...modifiedPlans,
            {
              ...newPlanData,
              id: newPlanId,
              start: new Date(utcStartDate),
              end: new Date(utcEndDate),
              complete: isCompleted,
            },
          ]);
          setIsAddModalOpen(false);
          setNewPlanData({
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            accessibility: true,
            isCompleted: false,
          });
        },
        onError: (error) => {
          alert(`추가 중 오류 발생: ${error.message}`);
        },
      },
    );
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deletePlan(parseInt(planId, 10), {
        onSuccess: () => {
          alert("플랜이 삭제되었습니다.");
          setModifiedPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== planId),
          );
        },
        onError: (error) => {
          alert(`삭제 중 오류 발생: ${error.message}`);
        },
      });
    }
  };

  const handlePlanChange = (updatedPlans: CalendarEvent[]) => {
    setModifiedPlans(updatedPlans);
  };

  const handleSaveAll = () => {
    setPendingPlans(true);
    Promise.all(
      modifiedPlans
        .filter((plan) => plan.id && !Number.isNaN(Number(plan.id)))
        .map((plan) =>
          apiClient.put(`/api/plans/${plan.id}`, {
            title: plan.title,
            description: plan.description,
            startDate: new Date(plan.start).toISOString(),
            endDate: new Date(plan.end).toISOString(),
            accessibility: plan.accessibility ?? true,
            isCompleted: plan.complete ?? false,
          }),
        ),
    )
      .then(() => {
        alert("수정사항이 저장되었습니다.");
        setPendingPlans(false);
        navigate(RouterPath.MAIN, { state: { refetchNeeded: true } });
      })
      .catch((error) => {
        alert(`저장 중 오류 발생: ${error.message}`);
        setPendingPlans(false);
      });
  };

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner="플래너 수정"
        plans={modifiedPlans}
        isReadOnly={false}
        onPlanChange={handlePlanChange}
        onDeletePlan={handleDeletePlan}
      />
      {pendingPlans && <p>저장 중...</p>}
      <ButtonGroup>
        <Button onClick={handleAddPlan} theme="secondary">
          플랜 추가
        </Button>
        <Button onClick={handleSaveAll}>저장</Button>
      </ButtonGroup>

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <ModalContainer>
            <Title>새로운 플랜 추가</Title>
            <StyledInput
              placeholder="제목"
              value={newPlanData.title}
              onChange={(e) =>
                setNewPlanData({ ...newPlanData, title: e.target.value })
              }
            />
            <StyledInput
              placeholder="설명"
              value={newPlanData.description}
              onChange={(e) =>
                setNewPlanData({ ...newPlanData, description: e.target.value })
              }
            />
            <ReactDatePicker
              placeholderText="시작 날짜 선택"
              selectedDate={
                newPlanData.startDate ? new Date(newPlanData.startDate) : null
              }
              onDateChange={(date: any) =>
                setNewPlanData((prevData) => ({
                  ...prevData,
                  startDate: date ? date.toISOString().slice(0, 16) : "",
                }))
              }
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
            />
            <ReactDatePicker
              placeholderText="종료 날짜 선택"
              selectedDate={
                newPlanData.endDate ? new Date(newPlanData.endDate) : null
              }
              onDateChange={(date: any) =>
                setNewPlanData((prevData) => ({
                  ...prevData,
                  endDate: date ? date.toISOString().slice(0, 16) : "",
                }))
              }
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
            />
            <Button onClick={handleAddPlanSubmit}>추가</Button>
          </ModalContainer>
        </Modal>
      )}
      {descriptionModalOpen && (
        <Modal onClose={() => setIsDescriptionModalOpen(false)}>
          <ModalContainer>
            <Title>전체 설명</Title>
            <p>{selectedDescription}</p>
            <Button onClick={() => setIsDescriptionModalOpen(false)}>
              닫기
            </Button>
          </ModalContainer>
        </Modal>
      )}
    </PageContainer>
  );
}
