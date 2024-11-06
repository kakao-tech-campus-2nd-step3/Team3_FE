import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";
import { AxiosResponse } from "axios";

interface UpdatePlanParams {
  teamId: number;
  planId: number;
  plan: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    accessibility: boolean;
    isCompleted: boolean;
  };
}

export const useUpdateTeamPlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, UpdatePlanParams>
) => {
  return useMutation<AxiosResponse<any>, Error, UpdatePlanParams>({
    mutationFn: ({ teamId, planId, plan }) =>
      apiClient.put(`/api/teams/${teamId}/plans/${planId}`, plan),
    ...options,
  });
};
