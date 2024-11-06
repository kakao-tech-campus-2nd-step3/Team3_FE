import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface DeletePlanCardParams {
  deviceId: string;
  groupId: string;
  cardId: string;
}

// 특정 플랜 카드를 삭제하는 API 요청 함수
const deletePlanCard = async ({
  deviceId,
  groupId,
  cardId,
}: DeletePlanCardParams) => {
  return apiClient.delete(
    `/api/preview-plan/card/${deviceId}/${groupId}/${cardId}`,
  );
};

// React Query와 useMutation을 사용하는 플랜 카드 삭제 훅

const useDeletePlanCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlanCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planCards"],
      });
    },
    onError: (error) => {
      console.error("플랜 카드 삭제 실패", error);
    },
  });
};

export default useDeletePlanCard;
