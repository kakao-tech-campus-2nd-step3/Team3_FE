import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface PreviewPlanData {
  title: string;
  description: string;
  startDate: string; // ISO 형식의 날짜 문자열
  endDate: string; // ISO 형식의 날짜 문자열
}

interface SavePreviewPlanParams {
  deviceId: string;
  groupId: string;
  planDataList: PreviewPlanData[];
}

// 프리뷰 플랜 저장 함수
const savePreviewPlan = async ({
  deviceId,
  groupId,
  planDataList,
}: SavePreviewPlanParams) => {
  const response = await apiClient.post(
    `/api/plans/save-preview/${deviceId}/${groupId}`,
    { plans: planDataList },
  );
  return response.data;
};

// 커스텀 훅
const useSavePreviewPlan = () => {
  return useMutation({
    mutationFn: (params: SavePreviewPlanParams) => savePreviewPlan(params),
    onSuccess: (data) => {
      console.log("프리뷰 플랜 저장 성공:", data);
    },
    onError: (error) => {
      console.error("프리뷰 플랜 저장 실패:", error);
    },
  });
};

export default useSavePreviewPlan;
