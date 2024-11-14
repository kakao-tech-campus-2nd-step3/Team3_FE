// src/pages/MainPage.tsx
import { useState, useEffect, useCallback } from "react";
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
import { requestForToken, setupOnMessageListener } from "@/api/firebaseConfig";
import { apiClient } from "@/api/instance";
import useUserData from "@/api/hooks/useUserData";

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
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 15px;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;
const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px;
  overflow: auto;
  box-sizing: border-box;
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none; /* focus:outline-none */
    border-color: #2196f3; /* focus:border-[#2196F3] */
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); /* focus:ring-2 focus:ring-[#2196F3] */
  }
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

  // Notification functionality (기존 코드 유지)
  useEffect(() => {
    const registerFcmToken = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const fcmToken = await requestForToken();
          if (fcmToken) {
            await apiClient.post("/api/fcm/register", { token: fcmToken });
            console.log("FCM 토큰이 성공적으로 등록되었습니다.");
          }
        } catch (err) {
          console.error("FCM 토큰 등록 중 오류 발생:", err);
        }
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    };

    registerFcmToken();
    setupOnMessageListener(); // Set up the listener for foreground messages
  }, []);

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
    } catch (error) {
      alert(`추가 중 오류 발생: ${error}`);
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
      } catch (error) {
        alert(`삭제 중 오류 발생: ${error}`);
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

      // 변경된 플랜들에 대해 서버에 업데이트
      for (const plan of changedPlans) {
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            alert(`플랜 업데이트 중 오류 발생: ${error.message}`);
          } else {
            alert("플랜 업데이트 중 알 수 없는 오류가 발생했습니다.");
          }
        }
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
          방문하기
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
