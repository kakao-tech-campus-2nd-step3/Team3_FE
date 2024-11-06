import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface GptRequestData {
  deviceId: string;
  text: string;
}

interface GptResponse {
  groupId: string;
  planCards: any[]; 
}

const sendGptRequest = async (
  level: "strong" | "moderate" | "light",
  data: GptRequestData,
): Promise<GptResponse> => {
  const response = await apiClient.post(
    `/api/gpt/member/${level}?deviceId=${data.deviceId}`,
    {
      text: data.text,
    },
  );
  return response.data;
};

const useGptRequest = () => {
  return useMutation({
    mutationFn: async (data: GptRequestData) => {
      const levels = ["strong", "moderate", "light"] as const;

      const responses = await Promise.all(
        levels.map((level) => sendGptRequest(level, data)),
      );
      return responses;
    },
  });
};

export default useGptRequest;