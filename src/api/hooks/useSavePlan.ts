import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../instance";

interface PlanCard {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
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

const useSavePlan = (p0: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: savePlan,
    onSuccess: p0.onSuccess,
    onError: p0.onError,
  });
};
export default useSavePlan;
