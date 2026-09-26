import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-linen px-4 py-12">
      <Link href="/" className="mb-8 text-center" aria-label={`${siteConfig.brandFull} — naar de website`}>
        <span className="font-display block text-3xl text-ink">{siteConfig.brandShort}</span>
        <span className="text-eyebrow mt-1 block !text-[0.625rem]">Beheer</span>
      </Link>
      <div className="w-full max-w-[400px] border border-hairline bg-surface p-7 shadow-[0_1px_2px_rgb(31_24_17/0.04)] sm:p-9">
        <h1 className="font-display text-2xl font-normal text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink-70">{description}</p>}
        <div className="mt-7">{children}</div>
      </div>
      {footer && <div className="mt-6 text-sm text-ink-70">{footer}</div>}
    </main>
  )
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-sm text-destructive">
      {children}
    </p>
  )
}
