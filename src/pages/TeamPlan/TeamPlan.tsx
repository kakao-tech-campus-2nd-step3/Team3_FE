import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  useFetchTeams,
  useDeleteTeam,
  useLeaveTeam,
  useRespondToInvitation,
  useFetchInvitations,
} from "@/api/hooks/useTeam";
import useUserData from "@/api/hooks/useUserData";
import Button from "@/components/common/Button/Button";
import breakpoints from "@/variants/breakpoints";
import { apiClient } from "@/api/instance";

// Styles
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 10px 45px;
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
  overflow-x: hidden; 
  @media (max-width: ${breakpoints.sm}px) {
    padding-top: 80px;
  }
  gap: 10px;
`;

const PageTitle = styled.div`
  margin-right: auto;
  color: black;
  font-size: 23px;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  margin-left: auto;
  padding: 8px;
  justify-content: flex-end;
  display: flex;
  gap: 8px;
`;

const PlanCard = styled.div`
  width: 100%;
  min-height: 99px;
  padding: 12.8px;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  border-radius: 16px;
  align-items: center;
  flex-wrap: wrap; 
  box-sizing: border-box;
`;

const PlanTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; 
  min-width: 200px;
`;

const PlanTitle = styled.div`
  color: black;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const Participants = styled.div`
  color: #aab2c8;
  font-size: 15px;
  font-weight: 700;
  word-break: break-word; 
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
  flex-wrap: wrap; 
`;

const Tab = styled.div<{ active: boolean }>`
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  color: ${(props) => (props.active ? "black" : "#9b9b9b")};
  cursor: pointer;
  transition: color 0.3s ease;
`;

const RoleBadge = styled.div<{ isAdmin: boolean }>`
  width: 55px;
  height: 20px;
  background-color: ${(props) => (props.isAdmin ? "#a6caec" : "#ffc002")};
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin-left: 8px;
`;

const InviteeItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f4f4f4;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const NicknameText = styled.span`
  font-weight: bold;
  color: #333;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
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

  const [activeTab, setActiveTab] = useState("teamList");
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: any[] }>({});
  const [sentInvitations, setSentInvitations] = useState<{
    [key: number]: any[];
  }>({});

  // 팀 멤버 정보 가져오기
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

  // 보낸 초대 정보 가져오기
  useEffect(() => {
    const fetchSentInvitations = async () => {
      const invitationsData: { [key: number]: any[] } = {};

      await Promise.all(
        teams.map(async (team) => {
          try {
            const response = await apiClient.get(
              `/api/teams/${team.id}/invitations`,
            );
            invitationsData[team.id] = response.data;
          } catch (error) {
            console.error(
              `Error fetching sent invitations for team ${team.id}:`,
              error,
            );
          }
        }),
      );

      setSentInvitations(invitationsData);
    };

    if (teams.length > 0) fetchSentInvitations();
  }, [teams]);

  const handleVisitClick = (teamId: number, teamName: string) => {
    const members = teamMembers[teamId] || [];
    navigate(`/team-plan/${teamId}`, { state: { teamName, teamId, members } });
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
  const renderedTeamList = teams.length > 0 ? (
    teams.map((team) => {
      const members = teamMembers[team.id] || [];
      const isAdmin = members.some(
        (member) => member.role === "ADMIN" && member.userId === userData.id,
      );

      return (
        <PlanCard key={team.id}>
          <PlanTitleContainer>
            <PlanTitle>
              {team.teamName}
              <RoleBadge isAdmin={isAdmin}>
                {isAdmin ? "관리자" : "멤버"}
              </RoleBadge>
            </PlanTitle>

            <Participants>
              참여자: {members.map((member) => member.nickname).join(", ")}
            </Participants>
          </PlanTitleContainer>
          <ButtonWrapper>
            <Button
              size="small"
              theme="primary"
              onClick={() => handleVisitClick(team.id, team.teamName)}
            >
              방문
            </Button>
            {isAdmin ? (
              <Button
                size="small"
                theme="secondary"
                onClick={() => deleteTeamMutation.mutate(team.id)}
              >
                삭제
              </Button>
            ) : (
              <Button
                size="small"
                theme="secondary"
                onClick={() => leaveTeamMutation.mutate(team.id)}
              >
                나가기
              </Button>
            )}
          </ButtonWrapper>
        </PlanCard>
      );
    })
  ) : (
    <EmptyMessage>팀이 없습니다.</EmptyMessage>
  );

  // 받은 요청 렌더링
  const renderedInvitations = invitations.length > 0 ? (
    invitations.map((invite) => (
      <PlanCard key={invite.invitationId}>
        <PlanTitleContainer>
          <PlanTitle>{invite.teamName}</PlanTitle>
        </PlanTitleContainer>
        <ButtonWrapper>
          <Button
            size="small"
            onClick={() => handleAcceptInvitation(invite.invitationId)}
          >
            수락
          </Button>
          <Button
            size="small"
            theme="secondary"
            onClick={() => handleRejectInvitation(invite.invitationId)}
          >
            거절
          </Button>
        </ButtonWrapper>
      </PlanCard>
    ))
  ) : (
    <EmptyMessage>받은 요청이 없습니다.</EmptyMessage>
  );

  // 보낸 요청 렌더링
  const renderedSentInvitations = teams.length > 0 ? (
    teams
      .filter((team) => {
        const members = teamMembers[team.id] || [];
        const isAdmin = members.some(
          (member) => member.role === "ADMIN" && member.userId === userData.id,
        );
        return isAdmin;
      })
      .map((team) => {
        const teamInvitations = sentInvitations[team.id] || [];
        if (teamInvitations.length === 0) return null;

        return (
          <div key={team.id} style={{ marginBottom: "20px" }}>
            <PlanTitle>{team.teamName}</PlanTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {teamInvitations.map((invite) => (
                <InviteeItem key={invite.invitationId}>
                  <NicknameText>{invite.nickname}</NicknameText>
                </InviteeItem>
              ))}
            </div>
          </div>
        );
      })
      .filter(Boolean)
  ) : (
    <EmptyMessage>보낸 요청이 없습니다.</EmptyMessage>
  );

  if (isLoadingTeams || isLoadingInvitations) return <div>Loading...</div>;

  return (
    <PageContainer>
      <PageTitle>팀 플랜</PageTitle>
      <ButtonWrapper>
        <Button theme="primary" size="long" onClick={handleVisitMaking}>
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
    </PageContainer>
  );
}
