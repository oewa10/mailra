"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  Tags,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Overzicht", icon: LayoutDashboard },
  { href: "/admin/products", label: "Producten", icon: Package },
  { href: "/admin/categories", label: "Categorieën", icon: Tags },
  { href: "/admin/account", label: "Account", icon: UserRound },
]

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
}

function Wordmark() {
  return (
    <Link href="/admin" className="block">
      <span className="font-display text-2xl leading-none text-canvas">{siteConfig.brandShort}</span>
      <span className="text-eyebrow mt-1.5 block !text-[0.625rem] !text-gold">Beheer</span>
    </Link>
  )
}

function SidebarContent({ email, onNavigate }: { email: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.replace("/admin/login")
      router.refresh()
    } catch {
      toast.error("Uitloggen is mislukt. Probeer het opnieuw.")
      setSigningOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col px-4 py-7">
      <div className="px-3">
        <Wordmark />
      </div>

      <nav aria-label="Beheer" className="mt-10 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-canvas/[0.08] font-medium text-canvas"
                  : "text-canvas/65 hover:bg-canvas/[0.05] hover:text-canvas",
              )}
            >
              {active && <span className="absolute inset-y-2 left-0 w-0.5 bg-gold" aria-hidden="true" />}
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-canvas/10 pt-5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-sm text-canvas/65 transition-colors hover:bg-canvas/[0.05] hover:text-canvas"
        >
          <ArrowUpRight className="h-[18px] w-[18px]" aria-hidden="true" />
          Bekijk website
        </a>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-[2px] px-3 py-2.5 text-left text-sm text-canvas/65 transition-colors hover:bg-canvas/[0.05] hover:text-canvas disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
          Uitloggen
        </button>
        <p className="truncate px-3 pt-3 text-xs text-canvas/45" title={email}>
          {email}
        </p>
      </div>
    </div>
  )
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] bg-olive-deep lg:block">
        <SidebarContent email={email} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-hairline bg-surface/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-[2px] text-ink hover:bg-linen"
          aria-label="Menu openen"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display text-xl text-ink">{siteConfig.brandShort}</span>
        <span className="text-eyebrow !text-[0.625rem]">Beheer</span>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[272px] border-none bg-olive-deep p-0"
          closeClassName="text-canvas ring-offset-olive-deep"
        >
          <SheetTitle className="sr-only">Navigatie</SheetTitle>
          <SidebarContent email={email} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <main id="main-content" className="lg:pl-[248px]">
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-12">{children}</div>
      </main>
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
      <div>
        {eyebrow && <p className="text-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-70">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
