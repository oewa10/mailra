import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/server"
import { AdminShell } from "@/components/admin/shell"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/admin/session-expired")

  return <AdminShell email={session.email}>{children}</AdminShell>
}
