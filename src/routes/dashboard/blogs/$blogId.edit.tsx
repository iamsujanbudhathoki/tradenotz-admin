import { BlogEditorPage } from '@/ui/pages/dashboard/BlogEditorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/blogs/$blogId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return < BlogEditorPage/>
}
