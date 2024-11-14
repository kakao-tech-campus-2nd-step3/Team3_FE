// src/pages/Friend/FriendDetailPage.tsx
import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useParams } from "react-router-dom";
import { Send, Edit, Delete, Check } from "@mui/icons-material";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/api/hooks/useGetComments";
import { useGetFriendPlans } from "@/api/hooks/useGetPlans";

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

const CommentSection = styled.div`
  padding: 24px;
  border-radius: 8px;
`;

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  align-items: flex-start;
  gap: 10px;
  background-color: #ffffff;
  padding: 16px 0px 16px 16px;
`;

const InputWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e0;
  background-color: #ffffff;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #464646;
  &::placeholder {
    color: rgba(70, 70, 70, 0.5);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #39a7f7;
  display: flex;
  align-items: center;
  padding: 4px;
  margin-left: 2px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentAuthor = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
`;

const CommentText = styled.div`
  font-size: 15px;
  color: #464646;
  margin-top: 4px;
`;

const CommentDate = styled.div`
  font-size: 14px;
  color: #718096;
`;

const CommentDateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  margin-right: auto;
  font-size: 9px;
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


export default function FriendDetailPage() {
  const { friendId } = useParams();
  const location = useLocation();
  const { Plans: myPlans, friendName, userId } = location.state || {};
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: plans = [], isLoading: isLoadingPlans } = useGetFriendPlans(
    Number(friendId),
  );

  const { data: comments = [], isLoading: isLoadingComments } =
    useCommentsQuery(Number(friendId));
  const createCommentMutation = useCreateCommentMutation(Number(friendId), {
    onSuccess: () => {
      alert("댓글 작성이 완료되었습니다");
      setNewComment("");
    },
  });
  const updateCommentMutation = useUpdateCommentMutation(Number(friendId));
  const deleteCommentMutation = useDeleteCommentMutation(Number(friendId));

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate({
      userId: Number(friendId),
      content: newComment,
    });
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate(
      {
        commentId,
        data: {
          userId,
          content: editContent,
        },
      },
      {
        onSuccess: () => {
          alert("수정이 완료되었습니다.");
          setEditingCommentId(null);
          setEditContent("");
        },
      },
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}일 전`;
  };

  if (isLoadingPlans || isLoadingComments) {
    return (
      <PageContainer>
        <ContentWrapper style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Spinner />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Heading>{friendName ? `${friendName}님의 계획표` : "계획표"}</Heading>
        <CalendarWrapper>
          {myPlans && myPlans.length > 0 ? (
            <CustomCalendar plans={myPlans} isReadOnly />
          ) : (
            <CustomCalendar plans={plans} isReadOnly />
          )}
        </CalendarWrapper>
        <Heading>댓글</Heading>
        <CommentSection>
          <CommentInput>
            <ProfileImage />
            <InputWrapper>
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요."
                aria-label="댓글 입력"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSubmitComment();
                }}
                disabled={createCommentMutation.isPending}
              />
              <IconButton
                onClick={handleSubmitComment}
                disabled={createCommentMutation.isPending}
              >
                <Send />
              </IconButton>
            </InputWrapper>
          </CommentInput>
          <CommentList>
            {comments.map((comment) => (
              <CommentItem key={comment.id}>
                <ProfileImage src={comment.writerProfileImage} />
                <CommentContent>
                  <CommentAuthor>{comment.writerNickname}</CommentAuthor>
                  {editingCommentId === comment.id ? (
                    <InputWrapper>
                      <Input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter")
                            handleUpdateComment(comment.id);
                        }}
                        disabled={updateCommentMutation.isPending}
                      />
                      <IconButton
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={updateCommentMutation.isPending}
                      >
                        <Check />
                      </IconButton>
                    </InputWrapper>
                  ) : (
                    <>
                      <CommentText>{comment.content}</CommentText>
                      <CommentDateWrapper>
                        <CommentDate>
                          {formatDate(comment.createdAt)}
                        </CommentDate>
                        {comment.writerId === userId && (
                          <ActionButtons>
                            <IconButton
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditContent(comment.content);
                              }}
                              disabled={
                                updateCommentMutation.isPending ||
                                deleteCommentMutation.isPending
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={
                                updateCommentMutation.isPending ||
                                deleteCommentMutation.isPending
                              }
                            >
                              <Delete />
                            </IconButton>
                          </ActionButtons>
                        )}
                      </CommentDateWrapper>
                    </>
                  )}
                </CommentContent>
              </CommentItem>
            ))}
          </CommentList>
        </CommentSection>
      </ContentWrapper>
    </PageContainer>
  );
}
