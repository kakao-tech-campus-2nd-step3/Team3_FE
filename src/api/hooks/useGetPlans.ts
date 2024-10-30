import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../instance";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";

// 플랜 목록을 가져오는 API 요청 함수
export const fetchPlans = async (): Promise<CalendarEvent[]> => {
  const response = await apiClient.get("/plans");

  // 데이터를 CalendarEvent 형식으로 변환
  const plans = response.data.map((plan: any) => ({
    id: plan.id.toString(), // id를 string으로 변환
    title: plan.title,
    description: plan.description,
    start: new Date(plan.startDate), // 날짜를 Date 객체로 변환
    end: new Date(plan.endDate),
    accessibility: plan.accessibility ?? null, // null 가능성 처리
    complete: plan.isCompleted,
    status: plan.is_completed ? "completed" : "incomplete", // 상태를 미리 계산
  }));

  return plans;
};

// 플랜을 가져오는 React Query 훅
export const useGetPlans = () => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
};
