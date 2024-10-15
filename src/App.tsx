import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import { queryClient } from "./api/instance";
import { LoginProvider } from "./provider/Auth";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginProvider>
        <Router />
      </LoginProvider>
    </QueryClientProvider>
  );
}

export default App;
