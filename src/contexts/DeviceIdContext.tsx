// src/contexts/DeviceIdContext.tsx
import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import useGenerateDeviceId from "@/api/hooks/useGenerateDeviceId";

interface DeviceIdContextType {
  deviceId: string | undefined;
  isLoading: boolean;
  isError: boolean;
}

// Context 생성 시 기본값 제공
const DeviceIdContext = createContext<DeviceIdContextType>({
  deviceId: undefined,
  isLoading: false,
  isError: false,
});

// Provider 컴포넌트
export function DeviceIdProvider({ children }: PropsWithChildren) {
  const { data: deviceId, isLoading, isError } = useGenerateDeviceId();

  // useMemo로 value 객체 메모이제이션
  const value = useMemo(
    () => ({
      deviceId,
      isLoading,
      isError,
    }),
    [deviceId, isLoading, isError],
  );

  return (
    <DeviceIdContext.Provider value={value}>
      {children}
    </DeviceIdContext.Provider>
  );
}

// 커스텀 훅
// eslint-disable-next-line react-refresh/only-export-components
export function useDeviceId() {
  const context = useContext(DeviceIdContext);
  if (!context) {
    throw new Error("useDeviceId must be used within a DeviceIdProvider");
  }
  return context;
}
