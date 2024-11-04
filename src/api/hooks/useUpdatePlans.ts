import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface UpdatePlanData {
  title: string;
  description: string;
  startTimestamp: number;
  endTimestamp: number;
  accessibility: boolean;
  isCompleted: boolean;
}

// 플랜 수정 함수
const updatePlan = async (planId: number, planData: UpdatePlanData) => {
  const response = await apiClient.put(`api/plans/${planId}`, planData);
  return response.data;
};

const useUpdatePlans = () => {
  return useMutation({
    mutationFn: ({
      planId,
      planData,
    }: {
      planId: number;
      planData: UpdatePlanData;
    }) => updatePlan(planId, planData),
    onSuccess: (data) => {
      console.log("플랜 수정 성공: ", data);
    },
    onError: (error) => {
      console.error("플랜 수정 실패: ", error);
    },
  });
};

export default useUpdatePlans;
