import {
  useQuery,
  useMutation,
  UseMutationOptions,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import { apiClient } from "@/api/instance";
import {
  Team,
  Invitation,
  InviteUserParams,
  SentInvitation,
  TeamMember,
} from "@/types/types";

// 팀 목록을 가져오는 API 요청 함수
export const fetchTeams = async (): Promise<Team[]> => {
  const response = await apiClient.get("/api/teams/my-teams");
  return response.data;
};
// 팀 목록을 가져오는 훅
export const useFetchTeams = () => {
  return useQuery<Team[], Error>({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });
};

// 팀 삭제 훅
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: number) => {
      const confirmed = window.confirm("정말로 팀을 삭제하시겠습니까?");
      if (!confirmed) {
        return; // 사용자가 취소를 누른 경우, 요청을 중단
      }
      await apiClient.delete(`/api/teams/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => {
      console.error("팀 삭제 오류:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          alert("해당 팀을 찾을 수 없습니다.");
        } else if (error.response.status === 403) {
          alert("팀 삭제 권한이 없습니다.");
        } else {
          alert("팀 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      } else {
        alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.");
      }
    },
  });
};

// 팀 나가기 훅
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: number) => {
      const confirmed = window.confirm("정말로 팀에서 나가시겠습니까?");
      if (!confirmed) {
        return;
      }
      await apiClient.delete(`/api/teams/${teamId}/leave`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

// 초대 목록을 조회하는 API 요청 함수
const fetchInvitations = async (): Promise<Invitation[]> => {
  const response = await apiClient.get("/api/teams/invitations");
  return response.data;
};
// 초대 목록을 조회하는 훅
export const useFetchInvitations = () => {
  return useQuery<Invitation[], Error>({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
  });
};

// 초대 응답 API 요청 함수
const respondToInvitation = async (params: {
  invitationId: number;
  isAccepted: boolean;
}): Promise<void> => {
  const { invitationId, isAccepted } = params;
  await apiClient.put(`/api/teams/invitation/${invitationId}/response`, null, {
    params: { isAccepted },
  });
};

// 초대 응답을 처리하는 훅
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { invitationId: number; isAccepted: boolean }
  >({
    mutationFn: respondToInvitation,
    onSuccess: () => {
      // 성공 시 초대 목록을 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

export const useInviteUserToTeam = () => {
  return useMutation({
    mutationFn: async ({ teamId, nickname }: InviteUserParams) => {
      // 초대 요청을 보낼 때 query로 닉네임 전달
      await apiClient.post(`/api/teams/${teamId}/invite`, null, {
        params: { nickname },
      });
    },
  });
};

export const useFetchSentInvitations = (teamId: number) => {
  return useQuery<SentInvitation[]>({
    queryKey: ["sentInvitations", teamId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/teams/${teamId}/invitations`);
      return response.data;
    },
    enabled: !!teamId,
    retry: false,
  });
};

// 관리자: 팀에서 유저를 내보내는 훅
interface RemoveUserParams {
  teamId: number;
  userId: number;
}

export const useRemoveUserFromTeam = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, RemoveUserParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, RemoveUserParams>({
    mutationFn: ({ teamId, userId }) =>
      apiClient.delete(`/api/teams/${teamId}/users/${userId}`),
    ...options,
  });
};

// 관리자: 유저 권한 수정
interface UpdateUserRoleParams {
  teamId: number;
  userId: number;
  role: string; // 예: 'admin', 'member' 등
}

export const useUpdateUserRole = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, UpdateUserRoleParams>,
) => {
  return useMutation<AxiosResponse<any>, Error, UpdateUserRoleParams>({
    mutationFn: ({ teamId, userId }) =>
      apiClient.put(`/api/teams/${teamId}/users/${userId}/role`),
    ...options,
  });
};

export function useGetTeamMembers(teamId: number) {
  return useQuery<TeamMember[]>({
    queryKey: ["teamMembers", teamId],
    queryFn: () =>
      apiClient.get(`/api/teams/${teamId}/members`).then((res) => res.data),
  });
}

interface CancelInvitationParams {
  invitationId: number;
  teamId: number;
}

export const useCancelTeamInvitation = (): UseMutationResult<
  void,
  AxiosError,
  CancelInvitationParams,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, CancelInvitationParams, unknown>({
    mutationFn: async ({ invitationId }: CancelInvitationParams) => {
      const response = await apiClient.delete(
        `/api/teams/invitation/${invitationId}/cancel`,
      );

      // 204 No Content 응답 확인
      if (response.status !== 204) {
        throw new Error("초대 취소 중 예상치 못한 응답을 받았습니다.");
      }
    },
    onSuccess: (_, variables) => {
      // 'sentInvitations' 쿼리를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({
        queryKey: ["sentInvitations", variables.teamId],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        alert("권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("초대를 찾을 수 없습니다.");
      } else {
        alert(`초대 취소 중 오류가 발생했습니다: ${error.message}`);
      }
    },
  });
};
