import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useParams } from "react-router-dom";
import { Send, Edit, Delete } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import { apiClient } from "@/api/instance";

const commentApi = {
  getComments: (userId: number) =>
    apiClient.get<Comment[]>(`/comments/${userId}`).then((res) => res.data),

  createComment: (data: { userId: number; content: string }) =>
    apiClient.put("/comments", data).then((res) => res.data),

  updateComment: (
    commentId: number,
    data: { userId: number; content: string },
  ) => apiClient.put(`/comments/${commentId}`, data).then((res) => res.data),

  deleteComment: (commentId: number) =>
    apiClient.delete(`/comments/${commentId}`).then((res) => res.data),
};

interface Comment {
  id: number;
  userId: number;
  writerId: number;
  writerNickname: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  flex: 1;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #464646;

  &:hover {
    color: #000;
  }
`;

export default function FriendDetailPage() {
  const queryClient = useQueryClient();
  const { friendId } = useParams();
  const location = useLocation();
  const { friendName, userId } = location.state || {};
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 댓글 목록 조회 쿼리
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", friendId], // URL에서 추출한 friendId (userId)를 사용
    queryFn: () => commentApi.getComments(Number(friendId)),
    enabled: !!friendId, // friendId가 존재할 때만 쿼리 실행
  });

  // 댓글 작성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
      setNewComment("");
    },
  });

  // 댓글 수정 뮤테이션
  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: { userId: number; content: string };
    }) => commentApi.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
      setEditingCommentId(null);
      setEditContent("");
    },
  });

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
    },
  });

  // 핸들러 함수들
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate({
      userId,
      content: newComment,
    });
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate({
      commentId,
      data: {
        userId,
        content: editContent,
      },
    });
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

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

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
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요."
              aria-label="댓글 입력"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmitComment();
                }
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
                        if (e.key === "Enter") {
                          handleUpdateComment(comment.id);
                        }
                      }}
                      disabled={updateCommentMutation.isPending}
                    />
                    <IconButton
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={updateCommentMutation.isPending}
                    >
                      <Send />
                    </IconButton>
                  </InputWrapper>
                ) : (
                  <>
                    <CommentBubble>
                      <CommentAuthor>{comment.writerNickname}</CommentAuthor>
                      <CommentText>{comment.content}</CommentText>
                    </CommentBubble>
                    <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                  </>
                )}
              </CommentBox>
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
            </CommentContent>
          </CommentItem>
        ))}
      </CommentSection>
    </PageContainer>
  );
}
