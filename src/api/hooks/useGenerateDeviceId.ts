import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

// const setDeviceIdCookie = (deviceId: string) => {
//   document.cookie = `device_id=${deviceId}; path=/; Secure; SameSite=Strict`;
// };

const fetchDeviceId = async () => {
  const response = await apiClient.get(`/api/gpt/generate-device-id`);
  const deviceId = response.data;

  // deviceId를 쿠키에 저장
  // setDeviceIdCookie(deviceId);

  return deviceId;
};

const useGenerateDeviceId = () => {
  return useQuery({
    queryKey: ["deviceId"],
    queryFn: fetchDeviceId,
  });
};

export default useGenerateDeviceId;
