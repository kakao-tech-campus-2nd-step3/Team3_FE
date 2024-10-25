import { http, HttpResponse } from "msw"; // HttpResponse 추가
import { apiBaseUrl } from "../instance";

const userMockHandlers = [
  // /api/users/me - 현재 로그인한 유저 정보 조회
  http.get(`${apiBaseUrl}/users/me`, () => {
    const userInfo = {
      id: 0,
      nickname: "어피치",
      profileImage: "https://example.com/profile.jpg",
      isPremium: true,
      createdAt: "2024-10-24T16:47:30.827Z",
      updatedAt: "2024-10-24T16:47:30.827Z",
    };

    return new HttpResponse(JSON.stringify(userInfo), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),
];

export default userMockHandlers;
