import { BlogsListPage } from '@/ui/pages/dashboard/BlogsListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/blogs/')({
  component: BlogsListPage,
})
