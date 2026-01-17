import { useAuth } from "@/hooks/useContext";
import type { RouteContextType } from "@/main";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  context: {
    user: null!,
  } satisfies RouteContextType,
});

export function RouterWithAuth() {
  const { user } = useAuth();

  router.update({
    context: { user },
  });

  return <RouterProvider router={router} />;
}
