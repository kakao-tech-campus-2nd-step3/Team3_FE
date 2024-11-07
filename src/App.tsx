import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import { queryClient } from "./api/instance";
import { AuthProvider } from "./provider/AuthProvider";
import { DeviceIdProvider } from "@/contexts/DeviceIdContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DeviceIdProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </DeviceIdProvider>
    </QueryClientProvider>
  );
}

export default App;
