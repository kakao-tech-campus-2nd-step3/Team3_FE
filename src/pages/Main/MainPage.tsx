import CustomCalendar from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";

const MainPage: React.FC = () => {
  const { data: plans, isLoading, error } = useGetPlans();
  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 처리
  }

  if (error) {
    return <div>Error: {error.message}</div>; // 에러 처리
  }

  return (
    <div>
      <CustomCalendar plans={plans || []} />
    </div>
  );
};

export default MainPage;
