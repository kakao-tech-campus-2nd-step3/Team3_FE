import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "@/api/instance";

interface ModifyPlanParams {
  planId: number;
  planData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    accessibility: boolean;
    isCompleted: boolean;
  };
}

const ModifyPlan = async ({
  planId,
  planData,
}: ModifyPlanParams): Promise<AxiosResponse<any>> => {
  return apiClient.put(`/api/plans/${planId}`, planData);
};

// useModifyPlan 훅 정의
const useModifyPlan = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, ModifyPlanParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, ModifyPlanParams>({
    mutationFn: ModifyPlan,
    ...options,
  });
};

export default useModifyPlan;
