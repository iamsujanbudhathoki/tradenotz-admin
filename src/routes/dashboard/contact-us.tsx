import ContactUsList from '@/ui/pages/dashboard/admin/ContactUsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/contact-us')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactUsList />
}
