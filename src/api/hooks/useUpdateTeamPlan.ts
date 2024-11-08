import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "@/api/instance";

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

const useUpdateTeamPlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, UpdatePlanParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, UpdatePlanParams>({
    mutationFn: ({ teamId, planId, plan }) =>
      apiClient.put(`/api/teams/${teamId}/plans/${planId}`, plan),
    ...options,
  });
};

export default useUpdateTeamPlan;
