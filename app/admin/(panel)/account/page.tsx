import { PageHeader } from "@/components/admin/shell"
import { ChangePasswordForm } from "@/components/admin/change-password-form"
import { getSession } from "@/lib/auth/server"

export const metadata = { title: "Account" }

export default async function AdminAccountPage() {
  const session = await getSession()

  return (
    <>
      <PageHeader eyebrow="Instellingen" title="Account" />

      <div className="grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="font-display text-xl text-ink">Ingelogd als</h2>
          <p className="mt-2 break-all text-sm text-ink-70">{session?.email}</p>
          <p className="mt-4 text-xs leading-relaxed text-ink-55">
            Uw sessie blijft 7 dagen geldig op dit apparaat. Log uit via het menu als u een gedeelde computer gebruikt. Na het wijzigen van uw wachtwoord worden alle andere apparaten automatisch uitgelogd.
          </p>
        </div>

        <section className="border border-hairline bg-surface p-6 sm:p-8 lg:col-span-2" aria-labelledby="password-heading">
          <h2 id="password-heading" className="font-display text-xl text-ink">
            Wachtwoord wijzigen
          </h2>
          <p className="mb-6 mt-1 text-sm text-ink-70">
            Gebruikt u nog het wachtwoord dat bij de installatie is aangemaakt? Wijzig het dan hier.
          </p>
          <ChangePasswordForm />
        </section>
      </div>
    </>
  )
}
