import React from "react";
import { useNavigate } from "react-router-dom";

const LoginModal: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 처리 로직 (추후 추가 가능)
    localStorage.setItem("authToken", "dummy-token");
    navigate("/main"); // 로그인 후 메인 페이지로 이동
  };

  return (
    <div>
      <h1>Login Modal</h1>
      <p>Please login to access your account.</p>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginModal;