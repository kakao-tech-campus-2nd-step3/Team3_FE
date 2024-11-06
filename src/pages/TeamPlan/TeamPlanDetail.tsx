import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetTeamPlans } from "@/api/hooks/useGetTeamPlan";
import { TeamMember } from "@/types/types";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";

const PageContainer = styled.div`
  width: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  overflow-x: hidden;
`;

const PageTitle = styled.div`
  align-self: stretch;
  color: black;
  font-size: 28.8px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  line-height: 22.52px;
  letter-spacing: 0.36px;
  word-wrap: break-word;
`;

const SectionTitle = styled(PageTitle)`
  font-size: 1.2rem;
  margin-top: 24px;
  margin-bottom: 13px;
`;

export const ParticipantsContainer = styled.div`
  padding: 8px;
  border-radius: 12.8px;
  overflow: hidden;
  border: 2.4px #d5d5d5 solid;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  display: flex;
  margin-bottom: 13px;
  margin-right: 8px;
`;

export const Participant = styled.div`
  padding: 8px;
  background: #f4f4f4;
  border-radius: 12.8px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;
`;

export const ParticipantName = styled.div`
  color: black;
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  word-wrap: break-word;
`;

export default function TeamPlanDetailPage() {
  const location = useLocation();
  const { teamName, teamId, members = [] } = location.state || {}; // 넘겨받은 멤버 목록

  const { data: teamPlans, isLoading, error } = useGetTeamPlans(teamId);
  const navigate = useNavigate();

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner={teamName ? `${teamName} 계획표` : "팀 플랜"}
        plans={teamPlans}
      />

      <SectionTitle>참여자</SectionTitle>
      <ParticipantsContainer>
        {members.map((member: TeamMember) => (
          <Participant key={member.userId}>
            <ParticipantName>{member.nickname}</ParticipantName>
          </Participant>
        ))}
      </ParticipantsContainer>
      <Button onClick={() => navigate(RouterPath.TEAM_PLAN_CHANGE, { state: { plans: teamPlans, teamId, teamName } })}>
  수정하기
</Button>
    </PageContainer>
  );
}
