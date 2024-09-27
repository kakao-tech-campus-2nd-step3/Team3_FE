// src/pages/TempPage.tsx
import Sidebar from '@/components/common/Sidebar/Sidebar'; 
import CustomCalendar from '@/components/features/PlanCalendar/CustomCalendar';

const TempPage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '225px', flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div style={{ flexGrow: 1, padding: '20px', margin:'40px' }}>
        <CustomCalendar />
        <div>
          <h1>임시 페이지</h1>
          <p>미완성입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default TempPage;
