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
