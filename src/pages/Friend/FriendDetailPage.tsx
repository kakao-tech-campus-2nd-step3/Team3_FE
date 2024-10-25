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

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* 10px의 80% */
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  gap: 24px; /* 30px의 80% */
  padding: 8px; /* 10px의 80% */
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10.4px 14.4px; /* 13px과 18px의 80% */
  border-radius: 12.8px; /* 16px의 80% */
  border: 1px solid black;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15.3px; /* 19.1px의 80% */
  font-family: "Inter", sans-serif;
  font-weight: 700;
  color: #464646;
  &::placeholder {
    color: rgba(70, 70, 70, 0.5);
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1.6px; /* 2px의 80% */
  background-color: #eeeeee;
  margin: 8px 0; /* 10px의 80% */
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px; /* 10px의 80% */
`;

const CommentContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px; /* 30px의 80% */
`;

const CommentBubble = styled.div`
  background-color: #d9d9d9;
  border-radius: 12.8px; /* 16px의 80% */
  padding: 8px 16.8px; /* 10px과 21px의 80% */
  display: flex;
  flex-direction: column;
  gap: 8px; /* 10px의 80% */
`;

const CommentBox = styled.div`
  border-radius: 12.8px; /* 16px의 80% */
  display: flex;
  flex-direction: column;
  gap: 8px; /* 10px의 80% */
`;

const CommentAuthor = styled.div`
  color: black;
  font-size: 15.3px; /* 19.1px의 80% */
  font-family: "Inter", sans-serif;
  font-weight: 700;
`;

const CommentText = styled.div`
  color: #464646;
  font-size: 15.3px; /* 19.1px의 80% */
  font-family: "Inter", sans-serif;
  font-weight: 700;
`;

const CommentDate = styled.div`
  align-self: flex-start;
  color: rgba(55.95, 55.95, 55.95, 0.7);
  font-size: 15.3px; /* 19.1px의 80% */
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-top: 4px; /* 5px의 80% */
  padding-left: 12px; /* 15px의 80% */
`;

export default function FriendDetailPage() {
  const location = useLocation();
  const { friendName } = location.state || {};

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner={friendName ? `${friendName}님의 계획표` : "계획표"}
      />
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
                <CommentAuthor>홍길동</CommentAuthor>
                <CommentText>흥미로운 계획표군요.</CommentText>
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
                <CommentAuthor>김길동</CommentAuthor>
                <CommentText>흥미로운 계획표군요.</CommentText>
              </CommentBubble>
              <CommentDate>2일전</CommentDate>
            </CommentBox>
          </CommentContent>
        </CommentItem>
      </CommentSection>
    </PageContainer>
  );
}
