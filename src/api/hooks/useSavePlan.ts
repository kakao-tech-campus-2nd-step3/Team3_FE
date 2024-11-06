import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface PlanCard {
  title: string;
  description: string;
  startTimestamp: number; // startDate 대신
  endTimestamp: number; // endDate 대신
  accessibility?: boolean;
  isCompleted?: boolean;
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
