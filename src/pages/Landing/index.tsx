import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../LoginModal";

const LandingPage: React.FC<{}> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate("/plan/preview");
  };

  return (
    <div>
      <h1>Welcome to the Landing Page!</h1>
      <button onClick={() => setIsModalOpen(true)}>Login</button>
      <button onClick={handleStartNow}>start Now</button>
      {isModalOpen && <LoginModal />}
    </div>
  );
};

export default LandingPage;
