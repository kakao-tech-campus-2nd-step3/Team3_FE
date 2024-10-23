import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import KAKAO_LOGO from "@/assets/kakao_logo.svg";
import { useLoginContext } from "@/provider/Auth";
import Button from "@/components/common/Button/Button";
import UnderlineTextField from "@/components/common/UnderlineTextField/UnderlineTextField";
import Spacing from "@/components/common/Spacing/Spacing";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FormWrapper = styled.article`
  width: 100%;
  max-width: 580px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 60px 52px;
`;

const Logo = styled.img`
  width: 88px;
  color: #333;
`;

// 버튼을 가운데 정렬하기 위한 컨테이너
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

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
    <Wrapper>
      <Logo src={KAKAO_LOGO} alt="카카오 CI" />
      <FormWrapper>
        <UnderlineTextField
          placeholder="이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Spacing
          height={{
            lg: 20,
            sm: 20,
          }}
        />
        <UnderlineTextField
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacing height={40} />
        <ButtonContainer>
          <Button theme="kakao" onClick={handleLogin}>
            로그인
          </Button>
        </ButtonContainer>
      </FormWrapper>
    </Wrapper>
  );
};

export default LoginModal;
