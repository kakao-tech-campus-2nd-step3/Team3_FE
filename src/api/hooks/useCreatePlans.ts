import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface CreatePlanData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  accessibility: boolean;
  isCompleted: boolean;
}

// 플랜 생성 함수
const createPlan = async (planData: CreatePlanData) => {
  const response = await apiClient.post("/api/plans", planData);
  return response.data;
};

const useCreatePlan = () => {
  return useMutation({
    mutationFn: createPlan,
    onSuccess: (data) => {
      console.log("플랜 생성 성공: ", data);
    },
    onError: (error) => {
      console.error("플랜 생성 실패: ", error);
    },
  });
};

export default useCreatePlan;
