import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../instance";

// 특정 플랜을 삭제하는 API 요청 함수
const deletePlan = async (planId: number) => {
  await apiClient.delete(`/api/plans/${planId}`);
};

// React Query와 useMutaition을 사용하는 플랜 삭제 훅
const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      // 플랜 목록을 최신 상태로 업데이트
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => {
      console.error("플랜 삭제 실패", error);
    },
  });
};

export default useDeletePlan;
