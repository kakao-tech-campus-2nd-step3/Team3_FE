import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

type GptResponseOrString = GptResponse | string;

const convertToKST = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.map((event) => ({
    ...event,
    start: new Date(new Date(event.start).getTime() + 9 * 60 * 60 * 1000),
    end: new Date(new Date(event.end).getTime() + 9 * 60 * 60 * 1000),
  }));
};

// gpt 요청 함수 - 동적 URL로 공통 함수 생성
const fetchGptData = async (
  url: string,
  { deviceId, text }: GptRequestParams,
): Promise<GptResponseOrString> => {
  const response = await apiClient.post(
    url,
    { text },
    { params: { deviceId } },
  );

  // 응답이 문자열인지 확인하여 처리
  if (typeof response.data === "string") {
    return response.data; // 단순 문자열 응답 반환
  }

  return {
    ...response.data,
    planCards: convertToKST(transformPlanData(response.data.planCards)), // 변환 함수 사용
  };
};

// 레벨별 훅
export const useGptLight = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/light", params),
    ...options,
  });

export const useGptModerate = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/moderate", params),
    ...options,
  });

export const useGptStrong = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/member/strong", params),
    ...options,
  });

export const useGptTrialLight = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/trial/light", params),
    ...options,
  });

export const useGptTrialModerate = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/trial/moderate", params),
    ...options,
  });

export const useGptTrialStrong = (
  options?: UseMutationOptions<
    GptResponseOrString,
    AxiosError,
    GptRequestParams
  >,
) =>
  useMutation<GptResponseOrString, AxiosError, GptRequestParams>({
    mutationFn: (params) => fetchGptData("/api/gpt/trial/strong", params),
    ...options,
  });
