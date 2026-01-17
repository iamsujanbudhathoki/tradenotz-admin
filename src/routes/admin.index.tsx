import { createFileRoute } from "@tanstack/react-router";
import AdminHomepage from "../ui/pages/dashboard/admin/AdminHompage";

export const Route = createFileRoute("/admin/")({
  component: AdminHomepage,
});
