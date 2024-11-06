import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";
import { Team } from "@/types/types";
import { Invitation } from "@/types/types";
import { InviteUserParams } from "@/types/types";
import { SentInvitation } from "@/types/types";

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
  });
};

// 팀 나가기 훅
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: number) => {
      const confirmed = window.confirm("정말로 팀에서 나가시겠습니까?");
      if (!confirmed) {
        return; // 사용자가 취소를 누른 경우, 요청을 중단
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
const respondToInvitation = async (params: { invitationId: number; isAccepted: boolean }): Promise<void> => {
  const { invitationId, isAccepted } = params;
  await apiClient.put(`/api/teams/invitation/${invitationId}/response`, null, {
    params: { isAccepted },
  });
};

// 초대 응답을 처리하는 훅
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { invitationId: number; isAccepted: boolean }>(
    {
      mutationFn: respondToInvitation,
      onSuccess: () => {
        // 성공 시 초대 목록을 다시 가져옴
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
      },
    }
  );
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


