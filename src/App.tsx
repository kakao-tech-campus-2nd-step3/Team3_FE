import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import { queryClient } from "./api/instance";
import { AuthProvider } from "./provider/AuthProvider";
import { ModalProvider } from "./context/LoginModalContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <Router />
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
