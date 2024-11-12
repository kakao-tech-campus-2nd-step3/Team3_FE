import styled from "@emotion/styled";
import Button from "@/components/common/Button/Button";
import { useModal } from "@/context/LoginModalContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
`;

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal } = useModal();
  const loginUrl = import.meta.env.VITE_LOGIN_URL;

  const handleLogin = async () => {
    try {
      window.location.href = loginUrl;
    } catch (e) {
      console.error("로그인 에러:", e);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <ModalOverlay onClick={closeLoginModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>세션이 만료되었습니다.</Title>
        <Description>다시 로그인해주세요. </Description>
        <Button theme="kakao" onClick={handleLogin}>
          Login with Kakao
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
