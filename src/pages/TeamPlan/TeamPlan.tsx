import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import breakpoints from '@/variants/variants';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`

  width: 100%;
  max-width: 1200px;
  height: 100vh;
  padding: 10px 45px;
  display: flex;
  flex-direction: column;
  
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
  @media (max-width: ${breakpoints.sm}px) {
    padding-top: 80px;
  }
    gap: 10px;
`;
//
const PageTitle = styled.div`
  margin-right: auto;
  color: black;
  font-size: 23px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  line-height: 22.52px;
  letter-spacing: 0.36px;
  word-wrap: break-word;
`;

const ButtonWrapper = styled.div`
  margin-left: auto;
  padding: 8px;
  justify-content: flex-end;
  
  gap: 8px;
  display: flex;
`;

const PlanCard = styled.div`
  width: 100%;
  height: 99px;
  padding: 12.8px;
  background: #F5F5F5;
  overflow: hidden;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  justify-content: space-between; 
  
  
  border-radius: 16px;
  box-sizing: border-box;
  width: 100%;
  flex-wrap: nowrap;
  
  
`;

const PlanTitleContainer = styled.div`
  justify-content: flex-start;
  align-items: left;
  display: flex;
  flex-direction: column
`;

const PlanTitle = styled.div`
  flex: 1;
  color: black;
  font-size: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  word-wrap: break-word;
`;

const Participants = styled.div`
  
  height: 32px;
  color: #AAB2C8;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  word-wrap: break-word;
`;



export default function TeamPlanPage() {
  const navigate = useNavigate();

  const handleVisitClick = () => {
  navigate(`/team-plan/1`);
};

  return (
    <PageContainer>
      <PageTitle>팀 플랜</PageTitle>
      <ButtonWrapper>
        <Button theme="primary" size='long'>팀 플랜 추가하기</Button>
      </ButtonWrapper>
      <PlanCard>
        
          <PlanTitleContainer>
          <PlanTitle>팀 플랜 1</PlanTitle>
          <Participants>참여자: 라이언 어피치</Participants>
        </PlanTitleContainer>
        
        
        <Button size="small" theme="primary" onClick={handleVisitClick}>
          방문
        </Button>
      </PlanCard>
    </PageContainer>
  );
}