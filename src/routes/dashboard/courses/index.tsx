import { CoursesListPage } from '@/ui/pages/dashboard/CoursesListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CoursesListPage />
}
