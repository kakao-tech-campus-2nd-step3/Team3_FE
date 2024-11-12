import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "@/api/instance";

interface SavePlanParams {
  teamId: number;
  plan: {
    title: string;
    description: string;
    startDate: string; // ISO format string
    endDate: string; // ISO format string
    accessibility: boolean;
    isCompleted: boolean;
  };
}

const useSaveTeamPlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, SavePlanParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, SavePlanParams>({
    mutationFn: ({ teamId, plan }) =>
      apiClient.post(`/api/teams/${teamId}/plans`, plan),
    ...options,
  });
};

export default useSaveTeamPlan;
