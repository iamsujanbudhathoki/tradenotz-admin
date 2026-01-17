import { createFileRoute } from '@tanstack/react-router'
import BlogList from '@/ui/pages/dashboard/admin/BlogList'

export const Route = createFileRoute('/dashboard/blogs')({
  component: BlogList,
})
