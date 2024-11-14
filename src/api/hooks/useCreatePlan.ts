// import { useMutation } from "@tanstack/react-query";
// import { apiClient } from "../instance";

// interface PlanCard {
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   accessibility?: boolean;
//   isCompleted?: boolean;
// }
// interface SavePlanData {
//   deviceId: string;
//   groupId: string;
//   planCards: PlanCard[];
// }
// const savePlan = async (data: SavePlanData) => {
//   const response = await apiClient.post("/api/gpt/plan/save", data);
//   return response.data;
// };

// const useCreatePlan = (p0: {
//   onSuccess: (data: any) => void;
//   onError: (error: any) => void;
// }) => {
//   return useMutation({
//     mutationFn: savePlan,
//     onSuccess: p0.onSuccess,
//     onError: p0.onError,
//   });
// };
// export default useCreatePlan;

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "@/api/instance";

interface SavePlanParams {
  plan: {
    title: string;
    description: string;
    startDate: string; // ISO format string
    endDate: string; // ISO format string
    accessibility: boolean;
    isCompleted: boolean;
  };
}

const useCreatePlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, SavePlanParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, SavePlanParams>({
    mutationFn: ({ plan }) => apiClient.post(`/api/plans`, plan),
    ...options,
  });
};

export default useCreatePlan;
