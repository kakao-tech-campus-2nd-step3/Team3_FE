// src/pages/MainPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import useCreatePlan from "@/api/hooks/useCreatePlan";
import useDeletePlan from "@/api/hooks/useDeletePlan";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";
import ReactDatePicker from "@/components/features/DatePicker/DatePicker";
import { apiClient } from "@/api/instance";
import useUserData from "@/api/hooks/useUserData";
import useNotificationSetup from "@/hooks/useNotificationSetup";

const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-top: 40px;
`;

const ButtonWrapper = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: center;
`;

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
    border-color: #2196f3; /* focus:border-[#2196F3] */
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); /* focus:ring-2 focus:ring-[#2196F3] */
  }
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px;
  overflow: auto;
  box-sizing: border-box;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #39a7f7;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function MainPage() {
  useNotificationSetup();

  const location = useLocation();
  const navigate = useNavigate();
  const { data: fetchedPlans, isLoading, error, refetch } = useGetPlans();
  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    accessibility: true,
    isCompleted: false,
  });
  const { mutateAsync: createPlan } = useCreatePlan();
  const { mutateAsync: deletePlan } = useDeletePlan();
  const { userData } = useUserData();
  const savePlanMutation = useCreatePlan();
  const isPlanSaved = useRef(false);

  // 플랜 데이터 초기화
  useEffect(() => {
    if (fetchedPlans) {
      setModifiedPlans(fetchedPlans);
    }
  }, [fetchedPlans]);

  useEffect(() => {
    if (location.state?.refetchNeeded) {
      refetch();
    }
  }, [location, refetch]);

  // 세션 스토리지의 plans 저장 useEffect
  useEffect(() => {
    const savePlans = async () => {
      const storedPlans = sessionStorage.getItem("plans");
      if (storedPlans && !isPlanSaved.current) {
        const parsedPlans: CalendarEvent[] = JSON.parse(storedPlans).map(
          (plan: CalendarEvent) => ({
            ...plan,
            start: new Date(plan.start),
            end: new Date(plan.end),
          }),
        );

        try {
          await Promise.all(
            parsedPlans.map((plan) =>
              savePlanMutation.mutateAsync({
                plan: {
                  title: plan.title,
                  description: plan.description,
                  startDate: plan.start.toISOString(),
                  endDate: plan.end.toISOString(),
                  accessibility: plan.accessibility ?? true,
                  isCompleted: plan.isCompleted ?? false,
                },
              }),
            ),
          );
          sessionStorage.removeItem("plans");
          console.log("세션의 플랜이 저장되었습니다.");
          isPlanSaved.current = true;
          refetch();
        } catch (err) {
          console.error("세션의 플랜 저장 실패:", err);
        }
      }
    };

    if (!isPlanSaved.current) {
      savePlans();
    }
  }, [savePlanMutation, refetch]);

  // 플랜 추가 핸들러
  const handleAddPlan = () => setIsAddModalOpen(true);

  const handleAddPlanSubmit = async () => {
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

    try {
      const response = await createPlan({
        plan: {
          title,
          description,
          startDate: utcStartDate,
          endDate: utcEndDate,
          accessibility,
          isCompleted,
        },
      });
      const newPlanId = String(response.data.id);
      alert("플랜이 추가되었습니다.");
      setModifiedPlans([
        ...modifiedPlans,
        {
          ...newPlanData,
          id: newPlanId,
          start: new Date(utcStartDate),
          end: new Date(utcEndDate),
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
    } catch (err) {
      alert(`추가 중 오류 발생: ${err}`);
    }
  };

  // 플랜 삭제 핸들러
  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deletePlan(parseInt(planId, 10));
        alert("플랜이 삭제되었습니다.");
        setModifiedPlans((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== planId),
        );
      } catch (err) {
        alert(`삭제 중 오류 발생: ${err}`);
      }
    }
  };

  // 플랜 변경 핸들러 (드래그 앤 드롭, 완료 여부 토글 등)
  const handlePlanChange = useCallback(
    async (updatedPlans: CalendarEvent[]) => {
      // 변경된 플랜 식별
      const changedPlans = updatedPlans.filter((updatedPlan) => {
        const originalPlan = modifiedPlans.find(
          (plan) => plan.id === updatedPlan.id,
        );
        if (!originalPlan) return true; // 새 플랜인 경우
        return (
          originalPlan.title !== updatedPlan.title ||
          originalPlan.description !== updatedPlan.description ||
          originalPlan.start.getTime() !== updatedPlan.start.getTime() ||
          originalPlan.end.getTime() !== updatedPlan.end.getTime() ||
          originalPlan.accessibility !== updatedPlan.accessibility ||
          originalPlan.isCompleted !== updatedPlan.isCompleted
        );
      });

      // 상태 업데이트
      setModifiedPlans(updatedPlans);

      // Promise.all을 사용하여 모든 플랜을 병렬로 업데이트
      const updatePlans = changedPlans.map(async (plan) => {
        try {
          await apiClient.put(`/api/plans/${plan.id}`, {
            title: plan.title,
            description: plan.description,
            startDate: new Date(plan.start).toISOString(),
            endDate: new Date(plan.end).toISOString(),
            accessibility: plan.accessibility ?? true,
            isCompleted: plan.isCompleted ?? false,
          });
          console.log(`플랜 ID ${plan.id}이 성공적으로 업데이트되었습니다.`);
        } catch (err) {
          if (err instanceof Error) {
            alert(`플랜 업데이트 중 오류 발생: ${err.message}`);
          } else {
            alert("플랜 업데이트 중 알 수 없는 오류가 발생했습니다.");
          }
          // 필요시 개별 에러를 처리하거나 다시 던질 수 있습니다.
          throw err;
        }
      });

      try {
        await Promise.all(updatePlans);
        console.log("모든 플랜이 성공적으로 업데이트되었습니다.");
      } catch (err) {
        console.error("일부 플랜 업데이트에 실패했습니다.", error);
        // 추가적인 에러 핸들링 로직을 여기에 작성할 수 있습니다.
      }
    },
    [modifiedPlans],
  );

  const handleVisitClick = () => {
    navigate(`/friend/${userData.id}`, {
      state: {
        Plans: modifiedPlans,
        friendName: userData.nickname,
        userId: userData.id,
      },
    });
  };

  if (isLoading)
    return (
      <PageContainer>
        <ContentWrapper
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spinner />
        </ContentWrapper>
      </PageContainer>
    );
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  return (
    <PageContainer>
      <CustomCalendar
        plans={modifiedPlans}
        isReadOnly={false}
        onPlanChange={handlePlanChange}
        onDeletePlan={handleDeletePlan}
      />
      <ButtonWrapper>
        <Button onClick={handleAddPlan} theme="secondary">
          플랜 추가
        </Button>
        <Button onClick={handleVisitClick} theme="secondary">
          댓글 조회
        </Button>
      </ButtonWrapper>

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
    </PageContainer>
  );
}
