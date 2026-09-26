"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/admin/shell"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { apiRequest, errorMessage } from "@/lib/admin/api-client"
import type { AdminCategory } from "@/lib/admin/types"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"

function productLabel(count: number) {
  return `${count} ${count === 1 ? "product" : "producten"}`
}

function CategoryEditor({
  open,
  category,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  category: AdminCategory | null
  onOpenChange: (open: boolean) => void
  onSaved: (category: AdminCategory, created: boolean) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(category?.name ?? "")
    setDescription(category?.description ?? "")
    setError(null)
  }, [open, category])

  const isNew = !category

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return setError("Vul een categorienaam in")
    setSaving(true)
    try {
      const saved = await apiRequest<AdminCategory>(
        isNew ? "/api/categories" : `/api/categories/${encodeURIComponent(category.id)}`,
        { method: isNew ? "POST" : "PUT", body: { name, description } },
      )
      toast.success(isNew ? `Categorie "${saved.name}" aangemaakt` : "Categorie opgeslagen")
      onSaved(saved, isNew)
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="bg-canvas sm:max-w-md">
        <form onSubmit={submit} noValidate>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">
              {isNew ? "Nieuwe categorie" : "Categorie bewerken"}
            </DialogTitle>
            <DialogDescription>
              Categorieën vormen de filters op de productpagina van de website.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5">
            <div>
              <Label htmlFor="category-name" className="mb-2 block text-sm text-ink">
                Naam
              </Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="bijv. Verlichting"
                maxLength={60}
                aria-invalid={!!error}
                autoFocus
              />
              {error ? (
                <p className="mt-1.5 text-xs text-destructive">{error}</p>
              ) : (
                <p className="mt-1.5 text-xs text-ink-55">
                  Webadres:{" "}
                  <span className="font-mono">
                    /producten/{isNew ? slugify(name || "naam") : category.id}
                  </span>
                  {!isNew && " (blijft gelijk bij hernoemen)"}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="category-description" className="mb-2 block text-sm text-ink">
                Beschrijving <span className="font-normal text-ink-55">(optioneel)</span>
              </Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Korte omschrijving van deze categorie"
              />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Annuleren
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isNew ? "Categorie aanmaken" : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CategoriesManager({
  initialCategories,
  openNew,
}: {
  initialCategories: AdminCategory[]
  openNew: boolean
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [editorOpen, setEditorOpen] = useState(openNew)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [pendingHide, setPendingHide] = useState<AdminCategory | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (openNew) window.history.replaceState(null, "", window.location.pathname)
  }, [openNew])

  const openEditor = (category: AdminCategory | null) => {
    setEditing(category)
    setEditorOpen(true)
  }

  const setActive = async (category: AdminCategory, active: boolean) => {
    setPendingHide(null)
    setTogglingIds((prev) => new Set(prev).add(category.id))
    setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, active } : c)))
    try {
      const updated = await apiRequest<AdminCategory>(`/api/categories/${encodeURIComponent(category.id)}`, {
        method: "PATCH",
        body: { active },
      })
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      toast.success(active ? `"${category.name}" staat weer op de website` : `"${category.name}" is verborgen`)
    } catch (error) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, active: !active } : c)))
      toast.error(errorMessage(error))
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(category.id)
        return next
      })
    }
  }

  const requestToggle = (category: AdminCategory, active: boolean) => {
    if (!active && category.active_product_count > 0) setPendingHide(category)
    else setActive(category, active)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await apiRequest(`/api/categories/${encodeURIComponent(pendingDelete.id)}`, { method: "DELETE" })
      setCategories((prev) => prev.filter((c) => c.id !== pendingDelete.id))
      toast.success(`Categorie "${pendingDelete.name}" verwijderd`)
      setPendingDelete(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const handleSaved = (saved: AdminCategory, created: boolean) => {
    setCategories((prev) =>
      (created ? [...prev, saved] : prev.map((c) => (c.id === saved.id ? saved : c))).sort((a, b) =>
        a.name.localeCompare(b.name, "nl"),
      ),
    )
    setEditorOpen(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Collectie"
        title="Categorieën"
        description="Bepaal hoe de collectie op de website is ingedeeld. Een verborgen categorie verbergt ook al haar producten."
        actions={
          <Button onClick={() => openEditor(null)}>
            <Plus className="h-4 w-4" />
            Nieuwe categorie
          </Button>
        }
      />

      {categories.length === 0 ? (
        <div className="border border-dashed border-sand bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink">Nog geen categorieën</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-70">
            Begin bijvoorbeeld met Stoelen, Tafels en Decoratie.
          </p>
          <Button className="mt-6" onClick={() => openEditor(null)}>
            <Plus className="h-4 w-4" />
            Eerste categorie aanmaken
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-hairline border border-hairline bg-surface">
          {categories.map((category) => (
            <li
              key={category.id}
              className={cn("flex items-center gap-4 p-4 sm:px-6 sm:py-5", !category.active && "bg-linen/40")}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <button
                    type="button"
                    onClick={() => openEditor(category)}
                    className={cn(
                      "font-display text-lg text-ink hover:underline",
                      !category.active && "text-ink-55",
                    )}
                  >
                    {category.name}
                  </button>
                  {!category.active && (
                    <span className="border border-hairline px-1.5 py-0.5 text-[0.6875rem] uppercase tracking-wider text-ink-55">
                      Verborgen
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink-70">{category.description}</p>
                )}
                <p className="mt-1 text-xs text-ink-55">
                  <Link
                    href={`/admin/products?category=${encodeURIComponent(category.id)}`}
                    className="link-underline text-gold-ink"
                  >
                    {productLabel(category.product_count)}
                  </Link>
                  {category.product_count > 0 && ` · ${category.active_product_count} zichtbaar`}
                </p>
              </div>

              <Switch
                checked={category.active}
                disabled={togglingIds.has(category.id)}
                onCheckedChange={(checked) => requestToggle(category, checked)}
                aria-label={`${category.name} zichtbaar op de website`}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={`Acties voor ${category.name}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => openEditor(category)}>
                    <Pencil className="h-4 w-4" />
                    Bewerken
                  </DropdownMenuItem>
                  {category.active && category.active_product_count > 0 && (
                    <DropdownMenuItem asChild>
                      <Link href={`/producten/${encodeURIComponent(category.id)}`} target="_blank">
                        <Eye className="h-4 w-4" />
                        Bekijk op website
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={category.product_count > 0}
                    onSelect={() => setPendingDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Verwijderen
                  </DropdownMenuItem>
                  {category.product_count > 0 && (
                    <p className="px-2 pb-1.5 pt-1 text-xs text-ink-55">
                      Kan pas worden verwijderd als er geen producten meer in staan.
                    </p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}

      <CategoryEditor
        open={editorOpen}
        category={editing}
        onOpenChange={setEditorOpen}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!pendingHide}
        onOpenChange={(open) => !open && setPendingHide(null)}
        title={`"${pendingHide?.name}" verbergen?`}
        description={`${productLabel(pendingHide?.active_product_count ?? 0)} uit deze categorie ${
          pendingHide?.active_product_count === 1 ? "verdwijnt" : "verdwijnen"
        } dan van de website. De instellingen per product blijven bewaard; zet de categorie later weer aan om alles terug te zetten.`}
        confirmLabel="Categorie verbergen"
        onConfirm={() => pendingHide && setActive(pendingHide, false)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Categorie verwijderen?"
        description={`"${pendingDelete?.name}" wordt definitief verwijderd.`}
        confirmLabel="Definitief verwijderen"
        destructive
        busy={deleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
