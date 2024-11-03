import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { apiClient } from "@/api/instance";

const setDeviceIdCookie = (deviceId: string) => {
  document.cookie = `device_id=${deviceId}; path=/; Secure; SameSite=Strict`;
};

const fetchDeviceId = async () => {
  const response = await apiClient.get(`/api/gpt/generate-device-id`);
  const deviceId = response.data;

  // deviceId를 쿠키에 저장
  setDeviceIdCookie(deviceId);

  return deviceId;
};

const useGenerateDeviceId = () => {
  const [cookies] = useCookies(["device_id"]);
  const deviceId = cookies.device_id;

  // deviceId가 쿠키에 이미 존재하는 경우, API 호출을 생략하고 기존 값 반환
  return useQuery({
    queryKey: ["deviceId"],
    queryFn: fetchDeviceId,
    enabled: !deviceId, // 쿠키에 deviceId가 없을 때만 호출
    initialData: deviceId, // 쿠키에 있는 deviceId를 초기값으로 설정
  });
};

export default useGenerateDeviceId;
