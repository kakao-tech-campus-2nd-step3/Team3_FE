// src/pages/TeamPlan/TeamPlanDetailPage.tsx
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import useGetTeamPlans from "@/api/hooks/useGetTeamPlan";
import { TeamMember } from "@/types/types";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import {
  useRemoveUserFromTeam,
  useUpdateUserRole,
  useGetTeamMembers,
} from "@/api/hooks/useTeam";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
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

const CalendarWrapper = styled.div`
  margin-bottom: 32px;
`;

const ParticipantsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const Participant = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f0f4fa;
  border-radius: 8px;
  color: #2d3748;
  font-size: 15px;
  font-weight: 600;
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RoleBadge = styled.span<{ isAdmin: boolean }>`
  background-color: ${(props) => (props.isAdmin ? "#ffc002" : "#a6caec")};
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #2d3748;
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
  &:hover {
    color: #3182ce;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 16px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #39a7f7;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function TeamPlanDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    teamName,
    teamId,

    myId,
  } = location.state || {};

  const { data: teamPlans, isLoading, error } = useGetTeamPlans(teamId);
  const { data: members = [], refetch: refetchMembers } =
    useGetTeamMembers(teamId);

  const isAdmin = members.some(
    (member: TeamMember) => member.userId === myId && member.role === "ADMIN",
  );

  const { mutate: removeUser } = useRemoveUserFromTeam({
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ["teamPlans", teamId] });
      refetchMembers();
    },
    onError: (err) => {
      alert(`사용자를 제거하는 중 오류가 발생했습니다: ${err.message}`);
    },
  });

  const { mutate: updateUserRole } = useUpdateUserRole({
    onSuccess: () => {
      // Invalidate and refetch team members
      queryClient.invalidateQueries({ queryKey: ["teamPlans", teamId] });
      refetchMembers();
    },
    onError: (err) => {
      alert(
        `사용자 역할을 업데이트하는 중 오류가 발생했습니다: ${err.message}`,
      );
    },
  });

  if (isLoading)
    return (
      <PageContainer>
        <ContentWrapper
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spinner />
        </ContentWrapper>
      </PageContainer>
    );
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  const handleRemoveUser = (userId: number) => {
    if (window.confirm("정말로 이 사용자를 팀에서 제거하시겠습니까?")) {
      removeUser({ teamId, userId });
    }
  };

  const handleToggleUserRole = (userId: number) => {
    updateUserRole({ teamId, userId, role: "toggle" });
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Heading>{teamName ? `${teamName} 계획표` : "팀 플랜"}</Heading>
        <CalendarWrapper>
          <CustomCalendar plans={teamPlans} isReadOnly />
        </CalendarWrapper>

        <Heading>참여자</Heading>
        <ParticipantsContainer>
          {members.map((member: TeamMember) => (
            <Participant key={member.userId}>
              <ParticipantInfo>
                {member.nickname}
                <RoleBadge isAdmin={member.role === "ADMIN"}>
                  {member.role === "ADMIN" ? "관리자" : "멤버"}
                </RoleBadge>
              </ParticipantInfo>
              {isAdmin && member.userId !== myId && (
                <AdminActions>
                  <ActionButton
                    onClick={() => handleToggleUserRole(member.userId)}
                  >
                    {member.role === "ADMIN" ? "멤버로 변경" : "관리자 승급"}
                  </ActionButton>
                  <ActionButton onClick={() => handleRemoveUser(member.userId)}>
                    제거
                  </ActionButton>
                </AdminActions>
              )}
            </Participant>
          ))}
        </ParticipantsContainer>

        {isAdmin && (
          <ButtonWrapper>
            <Button
              theme="primary"
              onClick={() =>
                navigate(RouterPath.TEAM_PLAN_MODIFY, {
                  state: { plans: teamPlans, teamId, teamName },
                })
              }
            >
              수정하기
            </Button>
            <Button
              theme="secondary"
              onClick={() =>
                navigate(RouterPath.TEAM_PLAN_INVITE, {
                  state: { teamId, teamName },
                })
              }
            >
              초대하기
            </Button>
          </ButtonWrapper>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}
