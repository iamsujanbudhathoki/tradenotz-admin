import type { RouteContextType } from "@/main";
import { DashboardLayout } from "@/ui/layouts/DashboardLayout";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useRouteContext,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  // @ts-ignore
  const { user } = useRouteContext({
    from: "__root__",
  }) as RouteContextType;


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
