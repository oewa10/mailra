import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "2026-05-12" (an HTML date input's value) → "12 mei 2026"; empty/invalid input passes through. */
export function formatDutchDate(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(date)
}
