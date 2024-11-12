// src/pages/TeamPlan/TeamPlanPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import { useQueries } from "@tanstack/react-query";
import {
  useFetchTeams,
  useDeleteTeam,
  useLeaveTeam,
  useRespondToInvitation,
  useFetchInvitations,
  useCancelTeamInvitation,
} from "@/api/hooks/useTeam";
import useUserData from "@/api/hooks/useUserData";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";
import { apiClient } from "@/api/instance";
import { TeamInvitation } from "@/types/types";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px;
  overflow: auto;
  box-sizing: border-box;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  gap: 8px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Tab = styled.div<{ active: boolean }>`
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  color: ${(props) => (props.active ? "#39a7f7" : "#9b9b9b")};
  cursor: pointer;
  transition: color 0.3s ease;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${breakpoints.lg}px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PlanCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
`;

const PlanTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const RoleBadge = styled.div<{ isAdmin: boolean }>`
  background-color: ${(props) => (props.isAdmin ? "#ffc002" : "#a6caec")};
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 8px;
`;

const Participants = styled.div`
  color: #4a5568;
  font-size: 15px;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
`;

const CancelIcon = styled(Close)`
  cursor: pointer;
  color: #ff4d4f;
  &:hover {
    color: #ff7875;
  }
`;

const ParticipantList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f4fa;
  padding: 8px 12px;
  border-radius: 8px;
`;

const ParticipantName = styled.span`
  margin-right: 4px;
  color: #2d3748;
`;

export default function TeamPlanPage() {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { data: teams = [], isLoading: isLoadingTeams } = useFetchTeams();
  const { data: invitations = [], isLoading: isLoadingInvitations } =
    useFetchInvitations();
  const deleteTeamMutation = useDeleteTeam();
  const leaveTeamMutation = useLeaveTeam();
  const respondToInvitationMutation = useRespondToInvitation();
  const cancelInvitationMutation = useCancelTeamInvitation();
  const [activeTab, setActiveTab] = useState("teamList");
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: any[] }>({});

  const adminTeams = teams.filter((team) => {
    const members = teamMembers[team.id] || [];
    return members.some(
      (member) => member.role === "ADMIN" && member.userId === userData.id,
    );
  });

  const sentInvitationsQueries = useQueries({
    queries: adminTeams.map((team) => ({
      queryKey: ["sentInvitations", team.id],
      queryFn: () =>
        apiClient
          .get(`/api/teams/${team.id}/invitations`)
          .then((res) => res.data),
      enabled: !!teamMembers[team.id],
    })),
  });

  useEffect(() => {
    const fetchAllMembers = async () => {
      const memberData: { [key: number]: any[] } = {};

      await Promise.all(
        teams.map(async (team) => {
          try {
            const response = await apiClient.get(
              `/api/teams/${team.id}/members`,
            );
            memberData[team.id] = response.data;
          } catch (error) {
            console.error(`Error fetching members for team ${team.id}:`, error);
          }
        }),
      );

      setTeamMembers(memberData);
    };

    if (teams.length > 0) fetchAllMembers();
  }, [teams]);

  const handleVisitClick = (
    teamId: number,
    teamName: string,
    isAdmin: boolean,
  ) => {
    const members = teamMembers[teamId] || [];
    navigate(`/team-plan/${teamId}`, {
      state: { teamName, teamId, members, isAdmin, myId: userData.id },
    });
  };

  const handleVisitMaking = () => {
    navigate("/team-plan/making");
  };

  const handleAcceptInvitation = (invitationId: number) => {
    respondToInvitationMutation.mutate({ invitationId, isAccepted: true });
  };

  const handleRejectInvitation = (invitationId: number) => {
    respondToInvitationMutation.mutate({ invitationId, isAccepted: false });
  };

  // 팀 목록 렌더링
  const renderedTeamList =
    teams.length > 0 ? (
      <CardGrid>
        {teams.map((team) => {
          const members = teamMembers[team.id] || [];
          const isAdmin = members.some(
            (member) =>
              member.role === "ADMIN" && member.userId === userData.id,
          );

          return (
            <PlanCard key={team.id}>
              <div>
                <PlanTitle>
                  {team.teamName}
                  <RoleBadge isAdmin={isAdmin}>
                    {isAdmin ? "관리자" : "멤버"}
                  </RoleBadge>
                </PlanTitle>
                <Participants>
                  참여자: {members.map((member) => member.nickname).join(", ")}
                </Participants>
              </div>
              <ButtonGroup>
                <Button
                  theme="primary"
                  onClick={() =>
                    handleVisitClick(team.id, team.teamName, isAdmin)
                  }
                >
                  방문
                </Button>
                {isAdmin ? (
                  <Button
                    theme="secondary"
                    onClick={() => deleteTeamMutation.mutate(team.id)}
                  >
                    삭제
                  </Button>
                ) : (
                  <Button
                    theme="secondary"
                    onClick={() => leaveTeamMutation.mutate(team.id)}
                  >
                    나가기
                  </Button>
                )}
              </ButtonGroup>
            </PlanCard>
          );
        })}
      </CardGrid>
    ) : (
      <EmptyMessage>팀이 없습니다.</EmptyMessage>
    );

  // 받은 요청 렌더링
  const renderedInvitations =
    invitations.length > 0 ? (
      <CardGrid>
        {invitations.map((invite) => (
          <PlanCard key={invite.invitationId}>
            <PlanTitle>{invite.teamName}</PlanTitle>
            <ButtonGroup>
              <Button
                theme="primary"
                onClick={() => handleAcceptInvitation(invite.invitationId)}
              >
                수락
              </Button>
              <Button
                theme="secondary"
                onClick={() => handleRejectInvitation(invite.invitationId)}
              >
                거절
              </Button>
            </ButtonGroup>
          </PlanCard>
        ))}
      </CardGrid>
    ) : (
      <EmptyMessage>받은 요청이 없습니다.</EmptyMessage>
    );

  // 보낸 요청 렌더링
  const renderedSentInvitations =
    adminTeams.length > 0 ? (
      <CardGrid>
        {adminTeams.map((team, index) => {
          const { data: teamInvitations = [], isLoading } =
            sentInvitationsQueries[index];

          if (isLoading) {
            return (
              <PlanCard key={team.id}>
                <div>로딩 중...</div>
              </PlanCard>
            );
          }

          if (teamInvitations.length === 0) return null;

          const handleCancelInvitation = (invitationId: number) => {
            if (window.confirm("초대를 취소하시겠습니까?")) {
              cancelInvitationMutation.mutate(
                { invitationId, teamId: team.id },
                {
                  onSuccess: () => {
                    alert("초대가 취소되었습니다.");
                  },
                },
              );
            }
          };

          return (
            <PlanCard key={team.id}>
              <div>
                <PlanTitle>{team.teamName}</PlanTitle>
                <Participants>
                  초대한 멤버:
                  <ParticipantList>
                    {teamInvitations.map((invite: TeamInvitation) => (
                      <ParticipantItem key={invite.invitationId}>
                        <ParticipantName>{invite.nickname}</ParticipantName>
                        <CancelIcon
                          onClick={() =>
                            handleCancelInvitation(invite.invitationId)
                          }
                        />
                      </ParticipantItem>
                    ))}
                  </ParticipantList>
                </Participants>
              </div>
            </PlanCard>
          );
        })}
      </CardGrid>
    ) : (
      <EmptyMessage>보낸 요청이 없습니다.</EmptyMessage>
    );

  if (isLoadingTeams || isLoadingInvitations) return <div>Loading...</div>;

  return (
    <PageContainer>
      <ContentWrapper>
        <Heading>팀 플랜</Heading>
        <ButtonWrapper>
          <Button theme="primary" onClick={handleVisitMaking}>
            팀 플랜 추가하기
          </Button>
        </ButtonWrapper>

        <TabsContainer>
          <Tab
            active={activeTab === "teamList"}
            onClick={() => setActiveTab("teamList")}
          >
            팀 목록
          </Tab>
          <Tab
            active={activeTab === "invitations"}
            onClick={() => setActiveTab("invitations")}
          >
            받은 요청
          </Tab>
          <Tab
            active={activeTab === "sentInvitations"}
            onClick={() => setActiveTab("sentInvitations")}
          >
            보낸 요청
          </Tab>
        </TabsContainer>

        {activeTab === "teamList" && renderedTeamList}
        {activeTab === "invitations" && renderedInvitations}
        {activeTab === "sentInvitations" && renderedSentInvitations}
      </ContentWrapper>
    </PageContainer>
  );
}
