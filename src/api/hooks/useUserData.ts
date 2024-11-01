import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/instance";

const useUserData = () => {
  const [userData, setUserData] = useState({
    id: 0,
    nickname: "",
    profileImage: "",
    isPremium: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // 현재 로그인한 유저 정보 가져오기
    apiClient
      .get("/api/users/me")
      .then((response) => setUserData(response.data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handlePaymentRequest = (subscriptionId: number) => {
    apiClient
      .post("/api/payment", {
        subscriptionId,
        price: 1000,
      })
      .then(() => {
        alert("결제가 완료되었습니다.");
      })
      .catch((error) => console.error("Error processing payment:", error));
  };

  const handleSubscription = () => {
    apiClient
      .post("/api/subscription/me/payment", {
        type: "MONTHLY",
      })
      .then(() => {
        alert("구독이 완료되었습니다.");
      })
      .catch((error) => console.error("error subscribtion:", error));
  };

  const handleDeleteAccount = () => {
    // 회원 탈퇴 API 호출
    if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
      apiClient
        .delete("/api/users/me")
        .then(() => {
          alert("회원 탈퇴가 완료되었습니다.");
          navigate("/");
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  return {
    userData,
    handlePaymentRequest,
    handleDeleteAccount,
    handleSubscription,
  };
};

export default useUserData;
