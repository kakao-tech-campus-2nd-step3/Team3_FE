import { http, HttpResponse } from "msw"; // HttpResponse 추가
import { apiBaseUrl } from "../instance";

const friendsMockHandlers = [
  // /api/friends - 친구 목록 조회
  http.get(`${apiBaseUrl}/friends`, () => {
    const friends = [
      {
        friend_id: 123,
        friend_name: "친구1",
        friend_profile_image:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
        createdAt: "2024-10-09T12:00:00Z",
      },
      {
        friend_id: 456,
        friend_name: "친구2",
        friend_profile_image:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
        createdAt: "2024-10-09T12:00:00Z",
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
        requester_id: 123,
        requester_name: "요청한 친구1",
        status: "pending",
        friend_profile_image:
          "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
      },
      {
        id: 126,
        requester_id: 456,
        requester_name: "요청한 친구2",
        status: "pending",
        friend_profile_image:
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
        receiver_id: 456,
        receiver_name: "라이언",
        status: "pending",
        friend_profile_image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8Jqv-qf5WyNCGm-BkaUB5GOGrZMVQPZCYg&s",
      },
      {
        id: 124,
        receiver_id: 789,
        receiver_name: "어피치",
        status: "accepted",
        friend_profile_image:
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
