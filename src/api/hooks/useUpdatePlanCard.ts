import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../instance";

export interface UpdatePlanCardData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// mutation 파라미터 타입 정의
interface UpdatePlanCardVariables {
  deviceId: string;
  groupId: string;
  cardId: string;
  planData: UpdatePlanCardData;
}

// updatePlanCard.tsx
const updatePlanCard = async (
  deviceId: string,
  groupId: string,
  cardId: string,
  planData: UpdatePlanCardData,
) => {
  try {
    console.log("API 호출 시작:", {
      url: `/api/preview-plan/card/${deviceId}/${groupId}/${cardId}`,
      data: planData,
    });

    const response = await apiClient.put(
      `/api/preview-plan/card/${deviceId}/${groupId}/${cardId}`,
      planData,
    );

    console.log("API 응답 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("API 호출 실패:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      serverError: error.response?.data,
      requestURL: error.config?.url,
      requestMethod: error.config?.method,
      requestData: error.config?.data,
    });
    throw error;
  }
};

const useUpdatePlanCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deviceId,
      groupId,
      cardId,
      planData,
    }: UpdatePlanCardVariables) => {
      console.log("mutation 시작:", {
        deviceId,
        groupId,
        cardId,
        planData,
      });
      return updatePlanCard(deviceId, groupId, cardId, planData);
    },

    onSuccess: (data, variables: UpdatePlanCardVariables) => {
      console.log("플랜 카드 수정 성공:", data);

      queryClient.invalidateQueries({
        queryKey: ["planCards", variables.groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["planCard", variables.cardId],
      });
    },

    onError: (error: any) => {
      console.error("mutation 에러:", error);
      console.error("플랜 카드 수정 실패 상세 정보:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        serverError: error.response?.data,
        requestURL: error.config?.url,
        requestMethod: error.config?.method,
        requestData: error.config?.data,
      });
    },
  });
};

export default useUpdatePlanCard;
