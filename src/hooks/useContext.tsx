import { AuthContext } from "@/context/AuthProvider";
import { DashboardContext } from "@/context/DashboardContext";
import { useContext } from "react";

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardLayout");
  }
  return context;
};




export function useAuth() {
  return useContext(AuthContext);
}
