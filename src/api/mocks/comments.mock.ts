import { http, HttpResponse } from "msw"; // HttpResponse 추가
import { apiBaseUrl } from "../instance";

const commentsMockHandlers = [
  // /api/comments/{userId} - 특정 유저의 댓글 조회
  http.get(`${apiBaseUrl}/comments/:userId`, () => {
    const comments = [
      {
        id: 789,
        writer_id: 123,
        writer_nickname: "어피치",
        writer_profile_image: "https://example.com/image1.jpg",
        content: "좋은 계획입니다!",
        created_at: "2024-09-05T10:00:00Z",
        updated_at: "2024-09-05T10:10:00Z",
      },
      {
        id: 790,
        writer_id: 456,
        writer_nickname: "프로도",
        writer_profile_image: "https://example.com/image2.jpg",
        content: "힘내세요!",
        created_at: "2024-09-05T11:00:00Z",
        updated_at: "2024-09-05T11:05:00Z",
      },
    ];

    return new HttpResponse(JSON.stringify(comments), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),
];

export default commentsMockHandlers;
