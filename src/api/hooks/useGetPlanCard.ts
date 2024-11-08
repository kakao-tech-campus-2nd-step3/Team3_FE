import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

export interface PlanCard {
  deviceId: string;
  groupId: string;
  cardId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface planGroupResponse {
  deviceId: string;
  groupId: string;
  planCards: PlanCard[];
}

const fetchPlans = async (deviceId: string): Promise<planGroupResponse[]> => {
  console.log("Fetching plans with deviceId:", deviceId); // deviceId 로그 확인
  const response = await apiClient.get<planGroupResponse[]>(
    `/api/preview-plan/`,
    {
      params: { deviceId },
    },
  );

  console.log("API response data:", response.data);
  return response.data;
};

const useGetPlanCard = (deviceId: string, p0: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["fetchPlans", deviceId],
    queryFn: () => fetchPlans(deviceId),
    enabled: !!deviceId,
  });
};

export default useGetPlanCard;
