import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { Send } from "@mui/icons-material";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
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

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10.4px 14.4px;
  border-radius: 12.8px;
  border: 1px solid black;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  color: #464646;
  &::placeholder {
    color: rgba(70, 70, 70, 0.5);
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1.6px;
  background-color: #eeeeee;
  margin: 8px 0;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const CommentContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;

const CommentBubble = styled.div`
  background-color: #d9d9d9;
  border-radius: 12.8px;
  padding: 8px 16.8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentBox = styled.div`
  border-radius: 12.8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentAuthor = styled.div`
  color: black;
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
`;

const CommentText = styled.div`
  color: #464646;
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
`;

const CommentDate = styled.div`
  align-self: flex-start;
  color: rgba(55.95, 55.95, 55.95, 0.7);
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-top: 4px;
  padding-left: 12px;
`;

export default function TeamPlanDetailPage() {
  const location = useLocation();
  const { teamName } = location.state || {};

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner={teamName ? `${teamName} 계획표` : "팀 플랜"}
      />

      <SectionTitle>참여자</SectionTitle>
      <ParticipantsContainer>
        <Participant>
          <ParticipantName>어피치</ParticipantName>
        </Participant>
        <Participant>
          <ParticipantName>프로도</ParticipantName>
        </Participant>
        <Participant>
          <ParticipantName>라이언</ParticipantName>
        </Participant>
        <Participant>
          <ParticipantName>춘식이</ParticipantName>
        </Participant>
        <Participant>
          <ParticipantName>네오</ParticipantName>
        </Participant>
      </ParticipantsContainer>

      <CommentSection>
        <CommentInput>
          <ProfileImage />
          <InputWrapper>
            <Input
              type="text"
              placeholder="댓글을 입력하세요."
              aria-label="댓글 입력"
            />
            <Send />
          </InputWrapper>
        </CommentInput>
        <Divider />
        <CommentItem>
          <CommentContent>
            <ProfileImage />
            <CommentBox>
              <CommentBubble>
                <CommentAuthor>춘식이</CommentAuthor>
                <CommentText>흠.</CommentText>
              </CommentBubble>
              <CommentDate>4일전</CommentDate>
            </CommentBox>
          </CommentContent>
        </CommentItem>
        <CommentItem>
          <CommentContent>
            <ProfileImage />
            <CommentBox>
              <CommentBubble>
                <CommentAuthor>프로도</CommentAuthor>
                <CommentText>성공합시다</CommentText>
              </CommentBubble>
              <CommentDate>2일전</CommentDate>
            </CommentBox>
          </CommentContent>
        </CommentItem>
      </CommentSection>
    </PageContainer>
  );
}
