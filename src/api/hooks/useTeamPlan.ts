import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";
import { transformPlanData } from "./useGetPlans";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";

// 요청 파라미터 타입 정의
interface GptRequestParams {
  deviceId: string;
  text: string;
}

// 서버에서 반환된 데이터 형식에 맞게 CalendarEvent 배열로 변환된 응답 타입 정의
interface GptResponse {
  deviceId: string;
  groupId: number;
  planCards: CalendarEvent[];
}

// gpt 요청 함수 - 동적 URL로 공통 함수 생성
const fetchGptData = async (
  url: string,
  { deviceId, text }: GptRequestParams,
): Promise<GptResponse> => {
  const response = await apiClient.post(
    url,
    { text },
    { params: { deviceId } },
  );
  return {
    ...response.data,
    planCards: transformPlanData(response.data.planCards), // 변환 함수 사용
  };
};

// 레벨별 훅
export const useGptLight = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestParams>,
) =>
  useMutation<GptResponse, Error, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/light", params),
    ...options,
  });

export const useGptModerate = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestParams>,
) =>
  useMutation<GptResponse, Error, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/moderate", params),
    ...options,
  });

export const useGptStrong = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestParams>,
) =>
  useMutation<GptResponse, Error, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/strong", params),
    ...options,
  });
