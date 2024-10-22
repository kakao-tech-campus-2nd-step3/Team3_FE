import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import { queryClient } from "./api/instance";
import { AuthProvider } from "./provider/useAuth";

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        
          <Router />
        
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
