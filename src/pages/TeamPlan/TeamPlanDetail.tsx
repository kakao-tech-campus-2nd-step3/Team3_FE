// src/pages/TeamPlan/TeamPlanDetailPage.tsx
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import useGetTeamPlans from "@/api/hooks/useGetTeamPlan";
import { TeamMember } from "@/types/types";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";

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
  padding: 8px 12px;
  background: #f0f4fa;
  border-radius: 8px;
  color: #2d3748;
  font-size: 15px;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export default function TeamPlanDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamName, teamId, members = [], isAdmin } = location.state || {};

  const { data: teamPlans, isLoading, error } = useGetTeamPlans(teamId);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

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
            <Participant key={member.userId}>{member.nickname}</Participant>
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
          </ButtonWrapper>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}
