import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../instance";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";

// CalendarEvent 타입 변환 함수
export const transformPlanData = (data: any[]): CalendarEvent[] => {
  return data.map((plan, index) => ({
    id: plan.id ? plan.id.toString() : `generated-id-${index}`, // id가 없을 때 고유 ID 생성
    title: plan.title,
    description: plan.description,
    start: plan.startDate
      ? new Date(plan.startDate)
      : new Date(plan.startTimestamp * 1000), // ISO와 timestamp 대응
    end: plan.endDate
      ? new Date(plan.endDate)
      : new Date(plan.endTimestamp * 1000), // ISO와 timestamp 대응
    accessibility: plan.accessibility ?? true, // 기본값 설정
    isCompleted: plan.isCompleted ?? false,
    status: plan.isCompleted ? "completed" : "incomplete",
  }));
};

// 본인 플랜 목록을 가져오는 API 요청 함수
export const fetchPlans = async (): Promise<CalendarEvent[]> => {
  const response = await apiClient.get("/api/plans");
  return transformPlanData(response.data); // 변환 함수 사용
};

// 본인 플랜을 가져오는 React Query 훅
export const useGetPlans = () => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: ["plans"],
    queryFn: async () => {
      const data = await fetchPlans(); // 변환된 데이터를 가져옴

      // KST로 변환하는 로직 추가
      const KSTOffset = 9 * 60 * 60 * 1000;
      const dataInKST = data.map((plan) => ({
        ...plan,
        start: new Date(plan.start.getTime() + KSTOffset),
        end: new Date(plan.end.getTime() + KSTOffset),
      }));

      return dataInKST;
    },
  });
};

// 친구의 플랜을 가져오는 API 요청 함수
export const fetchFriendPlans = async (
  friendId: number,
): Promise<CalendarEvent[]> => {
  const response = await apiClient.get(`/api/friends/${friendId}/plans`);
  console.log(response.data);
  return transformPlanData(response.data); // 변환 함수 사용
};

// 친구의 플랜을 가져오는 React Query 훅
export const useGetFriendPlans = (friendId: number) => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: ["friendPlans", friendId],
    queryFn: () => fetchFriendPlans(friendId),
    enabled: !!friendId, // friendId가 있을 때만 실행
  });
};
