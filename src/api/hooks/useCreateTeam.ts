import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "@/api/instance";

interface CreateTeamResponse {
  id: number;
  teamName: string;
  user: {
    id: number;
    nickname: string;
  };
  teamMembers: Array<{ id: number; nickname: string }>;
}

const useCreateTeam = (
  options?: UseMutationOptions<
    AxiosResponse<CreateTeamResponse>,
    Error,
    string
  >,
) => {
  return useMutation<AxiosResponse<CreateTeamResponse>, Error, string>({
    mutationFn: (teamName) =>
      apiClient.post<CreateTeamResponse>("/api/teams", null, {
        params: { teamName },
      }),
    ...options,
  });
};

export default useCreateTeam;
