import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

interface DeletePlanParams {
  teamId: number;
  planId: number;
}

export const useDeleteTeamPlan = (
  options?: UseMutationOptions<void, Error, DeletePlanParams>
) => {
  return useMutation<void, Error, DeletePlanParams>({
    mutationFn: async ({ teamId, planId }: DeletePlanParams): Promise<void> => {
      await apiClient.delete(`/api/teams/${teamId}/plans/${planId}`);
    },
    ...options,
  });
};