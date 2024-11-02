import { http, HttpResponse } from "msw";
import { apiBaseUrl } from "../instance";

const plansMockHandlers = [
  // /api/plans - 로그인한 사용자의 전체 플랜 리스트 조회
  http.get(`${apiBaseUrl}/plans`, () => {
    const plans = [
      {
        id: 1,
        title: "책 5장 정리",
        description: "집",
        startDate: "2024-10-23T19:00:00Z",
        endDate: "2024-10-23T22:00:00Z",
        accessibility: true,
        isCompleted: false,
        createdAt: "2024-09-01T10:00:00Z",
        updatedAt: "2024-09-02T10:00:00Z",
      },
      {
        id: 2,
        title: "프로젝트 회의",
        description: "ZEP 미팅",
        startDate: "2024-10-24T21:00:00Z",
        endDate: "2024-10-24T23:00:00Z",
        accessibility: false,
        isCompleted: false,
        createdAt: "2024-09-02T10:00:00Z",
        updatedAt: "2024-09-03T10:00:00Z",
      },
      {
        id: 3,
        title: "운동",
        description: "상체",
        start_date: "2024-10-26T22:00:00Z",
        end_date: "2024-10-26T24:00:00Z",
        accessibility: false,
        isCompleted: false,
        createdAt: "2024-09-05T10:00:00Z",
        updatedAt: "2024-09-05T10:00:00Z",
      },
    ];

    return new HttpResponse(JSON.stringify(plans), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),
];

export default plansMockHandlers;
