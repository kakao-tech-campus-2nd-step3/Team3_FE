import { http, HttpResponse } from "msw";
import { apiBaseUrl } from "../instance";

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

interface CommentRequest {
  userId: number;
  content: string;
}

// 댓글 목록을 저장할 변수 (실제 DB 역할)
let comments: Comment[] = [
  {
    id: 789,
    userId: 123,
    writerId: 123,
    writerNickname: "어피치",
    writerProfileImage: "https://example.com/image1.jpg",
    content: "친구 1의 계획표에 대한 댓글",
    createdAt: "2024-09-05T10:00:00Z",
    updatedAt: "2024-09-05T10:10:00Z",
  },
  {
    id: 790,
    userId: 123,
    writerId: 456,
    writerNickname: "프로도",
    writerProfileImage: "https://example.com/image2.jpg",
    content: "힘내세요!",
    createdAt: "2024-09-05T11:00:00Z",
    updatedAt: "2024-09-05T11:05:00Z",
  },
  {
    id: 791,
    userId: 456,
    writerId: 123,
    writerNickname: "어피치",
    writerProfileImage: "https://example.com/image1.jpg",
    content: "친구2의 계획표에 대한 댓글입니다",
    createdAt: "2024-09-05T12:00:00Z",
    updatedAt: "2024-09-05T12:00:00Z",
  },
];

const commentsMockHandlers = [
  // GET - 특정 유저의 댓글 조회
  http.get(`${apiBaseUrl}/comments/:userId`, ({ params }) => {
    const { userId } = params;
    const userComments = comments.filter(
      (comment) => comment.userId === Number(userId),
    );

    return HttpResponse.json(userComments);
  }),

  // PUT - 댓글 작성
  http.put(`${apiBaseUrl}/comments`, async ({ request }) => {
    const newComment = (await request.json()) as CommentRequest;

    if (newComment?.userId == null || newComment?.content == null) {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Bad Request: userId and content are required",
      });
    }

    const commentId = comments.length + 1;

    const comment: Comment = {
      id: commentId,
      userId: newComment.userId,
      writerId: 123, // Mock 데이터이므로 고정값 사용
      writerNickname: "어피치", // Mock 데이터이므로 고정값 사용
      writerProfileImage: "https://example.com/image1.jpg",
      content: newComment.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    comments.push(comment);
    return HttpResponse.json(comment, { status: 201 });
  }),

  // PUT - 댓글 수정
  http.put(`${apiBaseUrl}/comments/:commentId`, async ({ params, request }) => {
    const { commentId } = params;
    const updatedData = (await request.json()) as CommentRequest;

    if (updatedData?.content == null) {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Bad Request: content is required",
      });
    }

    const commentIndex = comments.findIndex(
      (comment) => comment.id === Number(commentId),
    );

    if (commentIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "Comment not found",
      });
    }

    comments[commentIndex] = {
      ...comments[commentIndex],
      content: updatedData.content,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(comments[commentIndex]);
  }),

  // DELETE - 댓글 삭제
  http.delete(`${apiBaseUrl}/comments/:commentId`, ({ params }) => {
    const { commentId } = params;

    const commentIndex = comments.findIndex(
      (comment) => comment.id === Number(commentId),
    );

    if (commentIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "Comment not found",
      });
    }

    comments = comments.filter((comment) => comment.id !== Number(commentId));
    return new HttpResponse(null, { status: 204 });
  }),
];

export default commentsMockHandlers;
