import { CourseEditorPage } from '@/ui/pages/dashboard/CourseEditorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/courses/new')({
  component: CourseEditorPage,
})
