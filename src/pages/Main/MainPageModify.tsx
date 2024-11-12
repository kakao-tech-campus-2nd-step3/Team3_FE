import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDatePicker from "@/components/features/DatePicker/DatePicker";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import useModifyPlan from "@/api/hooks/useModifyPlans";
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
    border-color: #6c63ff;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.3);
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
  const [newPlanData, setNewPlanData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    accessibility: true,
    isCompleted: false,
  });
  const navigate = useNavigate();

  const { mutate: modifyPlan } = useModifyPlan();
  const { mutate: createPlan } = useCreatePlan();
  const { mutate: deletePlan } = useDeletePlan();

  const handleAddPlan = () => setIsAddModalOpen(true);

  const handlePlanChange = (
    date: Date | null,
    field: "startDate" | "endDate",
  ) => {
    if (date) {
      const localDate = date.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss' 형식으로 저장
      setNewPlanData((prevData) => ({
        ...prevData,
        [field]: localDate,
      }));
    }
  };

  const updateModifiedPlans = (updatedPlans: CalendarEvent[]) => {
    const localPlans = updatedPlans.map((plan) => ({
      ...plan,
      start: new Date(plan.start), // 서버 응답 시간을 로컬 타임존으로 변환
      end: new Date(plan.end),
    }));
    setModifiedPlans(localPlans);
  };

  const handleAddPlanSubmit = () => {
    const {
      title,
      description,
      startDate,
      endDate,
      accessibility,
      isCompleted,
    } = newPlanData;

    createPlan(
      {
        plan: {
          title,
          description,
          startDate,
          endDate,
          accessibility,
          isCompleted,
        },
      },
      {
        onSuccess: () => {
          alert("플랜이 추가되었습니다.");
          setModifiedPlans([
            ...modifiedPlans,
            {
              ...newPlanData,
              id: Date.now().toString(),
              start: new Date(startDate),
              end: new Date(endDate),
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

  const handleSaveAll = () => {
    modifiedPlans.forEach((plan) => {
      // eslint-disable-next-line no-restricted-globals
      if (plan.id && !isNaN(Number(plan.id))) {
        modifyPlan({
          planId: Number(plan.id),
          planData: {
            title: plan.title,
            description: plan.description,
            startDate: new Date(plan.start).toISOString(), // 저장할 때 UTC로 변환
            endDate: new Date(plan.end).toISOString(),
            accessibility: plan.accessibility ?? true,
            isCompleted: plan.complete ?? false,
          },
        });
      }
    });
    alert("수정사항이 저장되었습니다.");
    navigate(RouterPath.MAIN, { state: { refetchNeeded: true } });
  };

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner={`${teamName} 수정`}
        plans={modifiedPlans}
        isReadOnly={false}
        onPlanChange={updateModifiedPlans}
        onDeletePlan={handleDeletePlan}
      />
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
              onDateChange={(date: any) => handlePlanChange(date, "startDate")}
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
            />
            <ReactDatePicker
              placeholderText="종료 날짜 선택"
              selectedDate={
                newPlanData.endDate ? new Date(newPlanData.endDate) : null
              }
              onDateChange={(date: any) => handlePlanChange(date, "endDate")}
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
            />
            <Button onClick={handleAddPlanSubmit}>추가</Button>
          </ModalContainer>
        </Modal>
      )}
    </PageContainer>
  );
}
