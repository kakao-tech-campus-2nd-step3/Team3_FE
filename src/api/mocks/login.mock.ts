import { http, HttpResponse } from "msw"; // HttpResponse 추가

const loginMockHandler = [
  http.post("https://kauth.kakao.com/oauth/token", () => {
    const responseBody = {
      access_token: "mock-access-token",
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      scope: "profile_nickname, profile_image",
    };
    return new HttpResponse(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),
];

export default loginMockHandler;
