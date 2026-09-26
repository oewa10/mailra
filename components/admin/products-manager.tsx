"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, MoreHorizontal, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/admin/shell"
import { Thumb } from "@/components/admin/thumb"
import { ProductEditor } from "@/components/admin/product-editor"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { apiRequest, errorMessage } from "@/lib/admin/api-client"
import type { AdminCategory, AdminProduct } from "@/lib/admin/types"
import { formatPrice } from "@/lib/price"
import { cn } from "@/lib/utils"

export type ProductStatusFilter = "all" | "active" | "hidden"
export type ProductIssueFilter = "no-image" | "no-description" | null
export type ProductSort = "newest" | "name" | "updated"

export type ProductFilters = {
  q: string
  category: string
  status: ProductStatusFilter
  issue: ProductIssueFilter
  sort: ProductSort
}

const STATUS_OPTIONS: { value: ProductStatusFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "active", label: "Zichtbaar" },
  { value: "hidden", label: "Verborgen" },
]

const ISSUE_LABELS: Record<Exclude<ProductIssueFilter, null>, string> = {
  "no-image": "Zonder afbeelding",
  "no-description": "Zonder beschrijving",
}

type PendingDelete = { ids: string[]; label: string }

export function ProductsManager({
  initialProducts,
  categories,
  initialFilters,
  openNew,
  editId,
}: {
  initialProducts: AdminProduct[]
  categories: AdminCategory[]
  initialFilters: ProductFilters
  openNew: boolean
  editId: string | null
}) {
  const [products, setProducts] = useState(initialProducts)
  const [query, setQuery] = useState(initialFilters.q)
  const [category, setCategory] = useState(initialFilters.category)
  const [status, setStatus] = useState(initialFilters.status)
  const [issue, setIssue] = useState(initialFilters.issue)
  const [sort, setSort] = useState(initialFilters.sort)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [bulkBusy, setBulkBusy] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleting, setDeleting] = useState(false)

  const initialEdit = editId ? initialProducts.find((p) => p.id === editId) ?? null : null
  const [editorOpen, setEditorOpen] = useState(openNew || !!initialEdit)
  const [editing, setEditing] = useState<AdminProduct | null>(initialEdit)

  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])
  const hiddenCategories = useMemo(
    () => new Set(categories.filter((c) => !c.active).map((c) => c.id)),
    [categories],
  )

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category !== "all") params.set("category", category)
    if (status !== "all") params.set("status", status)
    if (issue) params.set("issue", issue)
    if (sort !== "newest") params.set("sort", sort)
    const qs = params.toString()
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
    setSelected(new Set())
  }, [query, category, status, issue, sort])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false
      if (status === "active" && !p.active) return false
      if (status === "hidden" && p.active) return false
      if (issue === "no-image" && p.image) return false
      if (issue === "no-description" && p.description) return false
      if (!needle) return true
      return (
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (categoryNames.get(p.category) ?? p.category).toLowerCase().includes(needle)
      )
    })
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name, "nl"))
    if (sort === "updated") return [...list].sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    return [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
  }, [products, query, category, status, issue, sort, categoryNames])

  const filtersActive = query !== "" || category !== "all" || status !== "all" || issue !== null
  const allVisibleSelected = visible.length > 0 && visible.every((p) => selected.has(p.id))
  const someVisibleSelected = visible.some((p) => selected.has(p.id))

  const clearFilters = () => {
    setQuery("")
    setCategory("all")
    setStatus("all")
    setIssue(null)
  }

  const openEditor = (product: AdminProduct | null) => {
    setEditing(product)
    setEditorOpen(true)
  }

  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAllVisible = () =>
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map((p) => p.id)))

  const setActive = async (product: AdminProduct, active: boolean) => {
    setTogglingIds((prev) => new Set(prev).add(product.id))
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active } : p)))
    try {
      const updated = await apiRequest<AdminProduct>(`/api/products/${encodeURIComponent(product.id)}`, {
        method: "PATCH",
        body: { active },
      })
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      toast.success(active ? `"${product.name}" staat op de website` : `"${product.name}" is verborgen`)
    } catch (error) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: !active } : p)))
      toast.error(errorMessage(error))
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }
  }

  const bulkSetActive = async (active: boolean) => {
    const ids = [...selected]
    setBulkBusy(true)
    try {
      await apiRequest("/api/products/bulk", {
        method: "POST",
        body: { action: active ? "activate" : "deactivate", ids },
      })
      const now = new Date().toISOString()
      setProducts((prev) => prev.map((p) => (selected.has(p.id) ? { ...p, active, updated_at: now } : p)))
      toast.success(
        `${ids.length} ${ids.length === 1 ? "product" : "producten"} ${active ? "zichtbaar gemaakt" : "verborgen"}`,
      )
      setSelected(new Set())
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setBulkBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const { ids } = pendingDelete
    setDeleting(true)
    try {
      if (ids.length === 1) {
        await apiRequest(`/api/products/${encodeURIComponent(ids[0])}`, { method: "DELETE" })
      } else {
        await apiRequest("/api/products/bulk", { method: "POST", body: { action: "delete", ids } })
      }
      const removed = new Set(ids)
      setProducts((prev) => prev.filter((p) => !removed.has(p.id)))
      setSelected((prev) => new Set([...prev].filter((id) => !removed.has(id))))
      toast.success(ids.length === 1 ? `"${pendingDelete.label}" is verwijderd` : `${ids.length} producten verwijderd`)
      setPendingDelete(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const handleSaved = (saved: AdminProduct, created: boolean) => {
    setProducts((prev) => (created ? [saved, ...prev] : prev.map((p) => (p.id === saved.id ? saved : p))))
    setEditorOpen(false)
  }

  const rowMenu = (product: AdminProduct) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Acties voor ${product.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onSelect={() => openEditor(product)}>
          <Pencil className="h-4 w-4" />
          Bewerken
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/producten/${encodeURIComponent(product.category)}`} target="_blank">
            <Eye className="h-4 w-4" />
            Bekijk op website
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => setPendingDelete({ ids: [product.id], label: product.name })}
        >
          <Trash2 className="h-4 w-4" />
          Verwijderen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <PageHeader
        eyebrow="Collectie"
        title="Producten"
        description={
          products.length === 0
            ? "Nog geen producten."
            : `${products.length} ${products.length === 1 ? "product" : "producten"}, waarvan ${
                products.filter((p) => p.active).length
              } zichtbaar op de website.`
        }
        actions={
          <Button onClick={() => openEditor(null)} disabled={categories.length === 0}>
            <Plus className="h-4 w-4" />
            Nieuw product
          </Button>
        }
      />

      {categories.length === 0 && (
        <div className="mb-6 border border-hairline bg-linen/60 p-4 text-sm text-ink">
          Er zijn nog geen categorieën. <Link href="/admin/categories?new=1" className="link-underline font-medium text-gold-ink">Maak eerst een categorie aan</Link> om producten toe te kunnen voegen.
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-55" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoek op naam, beschrijving of categorie"
                className="bg-surface pl-9"
                aria-label="Producten zoeken"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-surface lg:w-[170px]" aria-label="Filter op categorie">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle categorieën</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div role="group" aria-label="Filter op zichtbaarheid" className="col-span-2 row-start-2 flex border border-input bg-surface p-0.5 lg:row-start-auto">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={status === option.value}
                    onClick={() => setStatus(option.value)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-sm transition-colors lg:flex-none",
                      status === option.value ? "bg-olive-ink text-canvas" : "text-ink-70 hover:text-ink",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <Select value={sort} onValueChange={(v) => setSort(v as ProductSort)}>
                <SelectTrigger className="w-full bg-surface lg:w-[170px]" aria-label="Sorteren">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Nieuwste eerst</SelectItem>
                  <SelectItem value="updated">Laatst bijgewerkt</SelectItem>
                  <SelectItem value="name">Naam A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex min-h-7 flex-wrap items-center gap-2 text-sm text-ink-55">
            <span>
              {visible.length === products.length
                ? `${products.length} ${products.length === 1 ? "product" : "producten"}`
                : `${visible.length} van ${products.length} producten`}
            </span>
            {issue && (
              <button
                type="button"
                onClick={() => setIssue(null)}
                className="inline-flex items-center gap-1 border border-hairline bg-surface px-2 py-0.5 text-xs text-ink hover:bg-linen"
              >
                {ISSUE_LABELS[issue]}
                <X className="h-3 w-3" aria-label="Filter verwijderen" />
              </button>
            )}
            {filtersActive && (
              <button type="button" onClick={clearFilters} className="link-underline text-xs text-gold-ink">
                Filters wissen
              </button>
            )}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="border border-dashed border-sand bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink">De collectie is nog leeg</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-70">
            Voeg uw eerste stoel, tafel of decoratiestuk toe. Het verschijnt direct op de website.
          </p>
          {categories.length > 0 && (
            <Button className="mt-6" onClick={() => openEditor(null)}>
              <Plus className="h-4 w-4" />
              Eerste product toevoegen
            </Button>
          )}
        </div>
      ) : visible.length === 0 ? (
        <div className="border border-hairline bg-surface px-6 py-14 text-center">
          <p className="text-ink">Geen producten gevonden met deze filters.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Filters wissen
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden border border-hairline bg-surface md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-hairline bg-linen/50 text-left text-xs uppercase tracking-[0.12em] text-ink-55">
                <tr>
                  <th scope="col" className="w-12 py-3 pl-4">
                    <Checkbox
                      checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                      onCheckedChange={toggleAllVisible}
                      aria-label="Alle zichtbare producten selecteren"
                    />
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">Product</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Categorie</th>
                  <th scope="col" className="hidden py-3 pr-4 font-medium lg:table-cell">Afmetingen</th>
                  <th scope="col" className="hidden py-3 pr-4 font-medium md:table-cell">Prijs</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Zichtbaar</th>
                  <th scope="col" className="w-12 py-3 pr-3">
                    <span className="sr-only">Acties</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {visible.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => openEditor(product)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-linen/40",
                      selected.has(product.id) && "bg-linen/60",
                    )}
                  >
                    <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(product.id)}
                        onCheckedChange={() => toggleSelected(product.id)}
                        aria-label={`${product.name} selecteren`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Thumb
                          src={product.image}
                          alt={product.name}
                          className={cn("h-14 w-11", !product.active && "opacity-50")}
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditor(product)
                            }}
                            className="text-left font-medium text-ink hover:underline"
                          >
                            {product.name}
                          </button>
                          <p className="line-clamp-1 max-w-md text-xs text-ink-55">
                            {product.description || <span className="italic">Geen beschrijving</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-70">{categoryNames.get(product.category) ?? product.category}</td>
                    <td className="hidden py-3 pr-4 text-ink-70 lg:table-cell">{product.dimensions || "—"}</td>
                    <td className="hidden py-3 pr-4 tabular-nums text-ink-70 md:table-cell">
                      {product.price == null ? "—" : formatPrice(product.price)}
                    </td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.active}
                          disabled={togglingIds.has(product.id)}
                          onCheckedChange={(checked) => setActive(product, checked)}
                          aria-label={`${product.name} zichtbaar op de website`}
                        />
                        {product.active && hiddenCategories.has(product.category) && (
                          <span className="text-xs text-ink-55" title="De categorie van dit product is verborgen">
                            via categorie verborgen
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-right">{rowMenu(product)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden">
            <label className="mb-2 flex items-center gap-3 px-1 py-2 text-sm text-ink-70">
              <Checkbox
                checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                onCheckedChange={toggleAllVisible}
              />
              Alles selecteren
            </label>
            <ul className="divide-y divide-hairline border border-hairline bg-surface">
              {visible.map((product) => (
                <li key={product.id} className={cn("flex items-center gap-3 p-3", selected.has(product.id) && "bg-linen/60")}>
                  <Checkbox
                    checked={selected.has(product.id)}
                    onCheckedChange={() => toggleSelected(product.id)}
                    aria-label={`${product.name} selecteren`}
                  />
                  <button
                    type="button"
                    onClick={() => openEditor(product)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Thumb
                      src={product.image}
                      alt={product.name}
                      className={cn("h-14 w-11", !product.active && "opacity-50")}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{product.name}</span>
                      <span className="block truncate text-xs text-ink-55">
                        {categoryNames.get(product.category) ?? product.category}
                        {!product.active
                          ? " · verborgen"
                          : hiddenCategories.has(product.category) && " · categorie verborgen"}
                      </span>
                    </span>
                  </button>
                  <Switch
                    checked={product.active}
                    disabled={togglingIds.has(product.id)}
                    onCheckedChange={(checked) => setActive(product, checked)}
                    aria-label={`${product.name} zichtbaar op de website`}
                  />
                  {rowMenu(product)}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {selected.size > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:left-[248px]">
          <div
            role="toolbar"
            aria-label="Bulkacties"
            className="pointer-events-auto flex flex-wrap items-center gap-1 bg-olive-deep p-1.5 pl-4 text-canvas shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="mr-2 text-sm tabular-nums">{selected.size} geselecteerd</span>
            <Button
              size="sm"
              variant="ghost"
              disabled={bulkBusy}
              onClick={() => bulkSetActive(true)}
              className="text-canvas hover:bg-canvas/10 hover:text-canvas"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Zichtbaar maken</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={bulkBusy}
              onClick={() => bulkSetActive(false)}
              className="text-canvas hover:bg-canvas/10 hover:text-canvas"
            >
              <EyeOff className="h-4 w-4" />
              <span className="hidden sm:inline">Verbergen</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={bulkBusy}
              onClick={() =>
                setPendingDelete({ ids: [...selected], label: `${selected.size} producten` })
              }
              className="text-canvas hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Verwijderen</span>
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setSelected(new Set())}
              aria-label="Selectie opheffen"
              className="text-canvas/70 hover:bg-canvas/10 hover:text-canvas"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ProductEditor
        open={editorOpen}
        product={editing}
        categories={categories}
        defaultCategory={category !== "all" ? category : categories[0]?.id ?? ""}
        onOpenChange={setEditorOpen}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={pendingDelete && pendingDelete.ids.length > 1 ? `${pendingDelete.ids.length} producten verwijderen?` : "Product verwijderen?"}
        description={
          pendingDelete && pendingDelete.ids.length > 1
            ? "Deze producten worden definitief verwijderd. Wilt u ze alleen tijdelijk van de website halen? Kies dan voor verbergen."
            : `"${pendingDelete?.label}" wordt definitief verwijderd. Wilt u het alleen tijdelijk van de website halen? Zet dan de zichtbaarheid uit.`
        }
        confirmLabel="Definitief verwijderen"
        destructive
        busy={deleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
