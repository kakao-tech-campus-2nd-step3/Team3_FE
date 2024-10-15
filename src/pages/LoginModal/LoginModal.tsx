import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "@/provider/Auth";

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useLoginContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 여기에 실제 API 요청 로직이 들어가야 함.
    const dummyAccessToken = "dummy-access-token";
    const dummyRefreshToken = "dummy-refresh-token";

    // login 함수 호출해서 토큰 저장 및 인증상태 저장
    login(dummyAccessToken, dummyRefreshToken);

    // 로그인 성공 후 메인 페이지로 이동
    navigate("/main");
  };

  return (
    <div>
      <h1>Login Modal</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginModal;
