import { http, HttpResponse } from "msw"; // HttpResponse 추가
import { apiBaseUrl } from "../instance";

const paymentMockHandlers = [
  // /api/payment/{paymentId} - 특정 결제 내역 조회
  http.get(`${apiBaseUrl}/payment/:paymentId`, () => {
    const paymentInfo = {
      id: 1,
      subscriptionId: 1234,
      price: 5000,
      status: "completed",
      paymentDate: "2024-10-24T16:48:41.934Z",
      createdAt: "2024-10-24T16:48:41.934Z",
    };

    return new HttpResponse(JSON.stringify(paymentInfo), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),
];

export default paymentMockHandlers;
