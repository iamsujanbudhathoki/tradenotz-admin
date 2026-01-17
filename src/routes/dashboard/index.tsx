import DashboardHome from "@/ui/pages/dashboard";
import {  createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: ()=>(
    <>
    <DashboardHome/>
    </>
  ),
});
