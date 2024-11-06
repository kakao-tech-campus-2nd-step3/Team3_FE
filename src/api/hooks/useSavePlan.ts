import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface PlanCard {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface SavePlanData {
  deviceId: string;
  groupId: string;
  planCards: PlanCard[];
}

const savePlan = async (data: SavePlanData) => {
  const response = await apiClient.post("/api/gpt/plan/save", data);
  return response.data;
};

const useSavePlan = () => {
  return useMutation({
    mutationFn: savePlan,
  });
};

export default useSavePlan;