import type { RouteContextType } from "@/main";
import { DashboardLayout } from "@/ui/layouts/DashboardLayout";
import {
  createFileRoute,
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



  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
