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
  width: 100%;
  margin: 0 auto;
  padding: 16px;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
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
  display: flex;
  align-items: center;
  color: rgba(55.95, 55.95, 55.95, 0.7);
  font-size: 15.3px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-top: 4px;
  padding-left: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 3px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: rgba(55.95, 55.95, 55.95, 0.7);
  font-size: 10px;
  display: flex;
  align-items: center;
  &:hover {
    color: #000;
  }
`;

export default function FriendDetailPage() {
  const { friendId } = useParams();
  const location = useLocation();
  const { friendName, userId } = location.state || {};
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
          setEditingCommentId(null); // 수정 후 수정 모드 종료
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

  if (isLoadingPlans || isLoadingComments) return <div>로딩 중...</div>;

  return (
    <PageContainer>
      <CustomCalendar
        calendarOwner={friendName ? `${friendName}님의 계획표` : "계획표"}
        plans={plans}
      />
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
        <Divider />
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentContent>
              <ProfileImage src={comment.writerProfileImage} />
              <CommentBox>
                {editingCommentId === comment.id ? (
                  <InputWrapper>
                    <Input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleUpdateComment(comment.id);
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
                    <CommentBubble>
                      <CommentAuthor>{comment.writerNickname}</CommentAuthor>
                      <CommentText>{comment.content}</CommentText>
                    </CommentBubble>
                    <CommentDate>
                      {formatDate(comment.createdAt)}
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
                    </CommentDate>
                  </>
                )}
              </CommentBox>
            </CommentContent>
          </CommentItem>
        ))}
      </CommentSection>
    </PageContainer>
  );
}
