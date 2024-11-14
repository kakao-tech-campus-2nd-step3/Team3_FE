import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";
import { transformPlanData } from "./useGetPlans";
import { CalendarEvent } from "@/components/features/CustomCalendar/CustomCalendar";

const fetchTeamPlans = async (teamId: number): Promise<CalendarEvent[]> => {
  const response = await apiClient.get(`/api/teams/${teamId}/plans`);
  // return transformPlanData(response.data); // 응답 데이터를 CalendarEvent 형식으로 변환
  const transformedData = transformPlanData(response.data).map((plan) => ({
    ...plan,
    id: String(plan.id), 
    start: new Date(plan.start.getTime() + 9 * 60 * 60 * 1000), // KST 변환
    end: new Date(plan.end.getTime() + 9 * 60 * 60 * 1000), // KST 변환
    isCompleted: plan.isCompleted ?? false,
  }));

  return transformedData;
};

const useGetTeamPlans = (teamId: number) => {
  const result = useQuery({
    queryKey: ["teamPlans", teamId],
    queryFn: () => fetchTeamPlans(teamId),
    enabled: !!teamId, // teamId가 있을 때만 요청 실행
  });

  return result;
};

export default useGetTeamPlans;
