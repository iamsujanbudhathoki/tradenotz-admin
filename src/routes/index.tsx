import { createFileRoute, redirect } from '@tanstack/react-router'
import type { RouteContextType } from '@/main'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const { user } = context as RouteContextType
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
    throw redirect({
      to: '/login',
    })
  },
  component: () => null,
})
