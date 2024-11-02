import { http, HttpResponse } from "msw"; // HttpResponse 추가
import { apiBaseUrl } from "../instance";

const friendsMockHandlers = [
  // /api/friends - 친구 목록 조회
  http.get(`${apiBaseUrl}/friends`, () => {
    const friends = [
      {
        userId: 123,
        nickname: "친구1",
        profileImage:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
      },
      {
        userId: 456,
        nickname: "친구2",
        profileImage:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
      },
    ];

    return new HttpResponse(JSON.stringify(friends), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),

  // 인증되지 않은 사용자 예시
  http.get(`${apiBaseUrl}/friends`, () => {
    return new HttpResponse(
      JSON.stringify({ message: "인증되지 않은 사용자입니다." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }),

  // /api/friends/requests/received - 받은 친구 요청 목록 조회
  http.get(`${apiBaseUrl}/friends/requests/received`, () => {
    const receivedRequests = [
      {
        id: 125,
        requesterId: 123,
        requesterName: "요청한 친구1",
        status: "pending",
        profileImage:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
      },
      {
        id: 126,
        requesterId: 456,
        requesterName: "요청한 친구2",
        status: "pending",
        profileImage:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
      },
    ];

    return new HttpResponse(JSON.stringify(receivedRequests), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),

  http.get(`${apiBaseUrl}/friends/requests/received`, () => {
    return new HttpResponse(
      JSON.stringify({ message: "인증되지 않은 사용자입니다." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }),

  // /api/friends/requests/sent - 보낸 친구 요청 목록 조회
  http.get(`${apiBaseUrl}/friends/requests/sent`, () => {
    const sentRequests = [
      {
        id: 123,
        receiverId: 456,
        receiverName: "라이언",
        status: "pending",
        profileImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8Jqv-qf5WyNCGm-BkaUB5GOGrZMVQPZCYg&s",
      },
      {
        id: 124,
        receiverId: 789,
        receiverName: "어피치",
        status: "accepted",
        profileImage:
          "https://godomall.speedycdn.net/487a9bef7fd92a07c4bc961602bce76a/goods/1000000392/image/detail/1000000392_detail_098.png",
      },
    ];

    return new HttpResponse(JSON.stringify(sentRequests), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),

  http.get(`${apiBaseUrl}/friends/requests/sent`, () => {
    return new HttpResponse(
      JSON.stringify({ message: "인증되지 않은 사용자입니다." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      },
    );
  }),
];

export default friendsMockHandlers;
