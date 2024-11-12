import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface GptRequestData {
  deviceId: string;
  text: string;
}
interface GptResponse {
  groupId: string;
  planCards: any[]; // 정확한 구조를 알고 있다면 any 대신 구체적인 타입으로 지정하세요.
}
const sendGptRequest = async (
  level: "light" | "moderate" | "strong",
  data: GptRequestData,
): Promise<GptResponse> => {
  const response = await apiClient.post(
    `/api/gpt/trial/${level}?deviceId=${data.deviceId}`,
    {
      text: data.text,
    },
  );
  return response.data;
};
const useGptTrial = () => {
  return useMutation({
    mutationFn: async (data: GptRequestData) => {
      const levels = ["light", "moderate", "strong"] as const;
      const responses = await Promise.all(
        levels.map((level) => sendGptRequest(level, data)),
      );
      return responses;
    },
  });
};
export default useGptTrial;
