
import type { RouteContextType } from "@/main";
import { useRouteContext } from "@tanstack/react-router";
import AdminHomepage from "./admin/AdminHompage";

const DashboardHome = () => {
  // @ts-ignore
  const { user } = useRouteContext({ from: "__root__" }) as RouteContextType;

  const renderDashboard = () => {
    return <AdminHomepage />;
  }

  return <>{renderDashboard()}</>;
};

export default DashboardHome;
