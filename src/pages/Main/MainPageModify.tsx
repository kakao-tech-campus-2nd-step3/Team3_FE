import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import useModifyPlan from "@/api/hooks/useModifyPlans";
import useCreatePlan from "@/api/hooks/useCreatePlan";
import useDeletePlan from "@/api/hooks/useDeletePlan";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";
import RouterPath from "@/router/RouterPath";

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

  const handleAddPlanSubmit = () => {
    const {
      title,
      description,
      startDate,
      endDate,
      accessibility,
      isCompleted,
    } = newPlanData;
    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();

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
        onSuccess: () => {
          alert("플랜이 추가되었습니다.");
          setModifiedPlans([
            ...modifiedPlans,
            {
              ...newPlanData,
              id: Date.now().toString(), // 가상의 ID 생성
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

  const handlePlanChange = (updatedPlans: CalendarEvent[]) => {
    setModifiedPlans(updatedPlans);
  };

  const handleSaveAll = () => {
    modifiedPlans.forEach((plan) => {
      if (plan.id && !isNaN(Number(plan.id))) {
        modifyPlan({
          planId: Number(plan.id),
          planData: {
            title: plan.title,
            description: plan.description,
            startDate: plan.start.toISOString(),
            endDate: plan.end.toISOString(),
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
        onPlanChange={handlePlanChange}
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
          <h2>새로운 플랜 추가</h2>
          <input
            placeholder="제목"
            value={newPlanData.title}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, title: e.target.value })
            }
          />
          <input
            placeholder="설명"
            value={newPlanData.description}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, description: e.target.value })
            }
          />
          <input
            type="datetime-local"
            placeholder="시작 시간"
            value={newPlanData.startDate}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, startDate: e.target.value })
            }
          />
          <input
            type="datetime-local"
            placeholder="종료 시간"
            value={newPlanData.endDate}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, endDate: e.target.value })
            }
          />
          <Button onClick={handleAddPlanSubmit}>추가</Button>
        </Modal>
      )}
    </PageContainer>
  );
}
