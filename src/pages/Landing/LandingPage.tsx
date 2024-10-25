import Introduce from "@/components/features/Introduce/Introduce";
import Navbar from "@/components/features/Navbar/Navbar";
import HowToUse from "@/components/features/HowToUse/HowToUse";

// 스타일 정의

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Introduce />
      <HowToUse />
    </>
  );
};

export default LandingPage;
