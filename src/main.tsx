import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";

import { APIConfig } from "./config/api.config";
import { AuthProvider } from "./context/AuthProvider";
import { RouterWithAuth } from "./HOC/RouterWithAuth";

const queryClient = new QueryClient();


export interface RouteContextType {
  user: (Record<string, any>) | null;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    routeContext: RouteContextType;
  }
}


APIConfig();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
