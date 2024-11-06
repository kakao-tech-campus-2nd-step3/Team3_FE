import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";
import { AxiosResponse } from "axios";

interface SavePlanParams {
  teamId: number;
  plan: {
    title: string;
    description: string;
    startDate: string; // ISO format string
    endDate: string;   // ISO format string
    accessibility: boolean;
    isCompleted: boolean;
  };
}

export const useSaveTeamPlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, SavePlanParams>
) => {
  return useMutation<AxiosResponse<any>, Error, SavePlanParams>({
    mutationFn: ({ teamId, plan }) =>
      apiClient.post(`/api/teams/${teamId}/plans`, plan),
    ...options,
  });
};