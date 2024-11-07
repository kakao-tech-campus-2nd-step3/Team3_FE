import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

export interface GptRequestData {
  deviceId: string;
  text: string;
}

interface GptResponse {
  groupId: string;
  planCards: any[];
}

export const sendGptTrialRequest = async (
  level: "light" | "moderate" | "strong",
  data: GptRequestData,
): Promise<GptResponse> => {
  const response = await apiClient.post(
    `/api/gpt/trial/${level}`,
    { text: data.text },
    { params: { deviceId: data.deviceId } },
  );
  return response.data;
};

export const useGptLight = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestData>,
) => {
  return useMutation<GptResponse, Error, GptRequestData>({
    mutationFn: (data) => sendGptTrialRequest("light", data),
    ...options,
  });
};

export const useGptModerate = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestData>,
) => {
  return useMutation<GptResponse, Error, GptRequestData>({
    mutationFn: (data) => sendGptTrialRequest("moderate", data),
    ...options,
  });
};

export const useGptStrong = (
  options?: UseMutationOptions<GptResponse, Error, GptRequestData>,
) => {
  return useMutation<GptResponse, Error, GptRequestData>({
    mutationFn: (data) => sendGptTrialRequest("strong", data),
    ...options,
  });
};
