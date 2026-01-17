import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../ui/pages/landingpage/auth/LoginPage";
import type { RouteContextType } from "../main";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    // If user is already logged in, redirect to dashboard
    if ((context as RouteContextType)?.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: LoginPage,
});
