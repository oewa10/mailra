"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiRequest, errorMessage } from "@/lib/admin/api-client"
import { resizeImage } from "@/lib/admin/resize-image"
import type { AdminCategory, AdminProduct } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

type FormState = {
  name: string
  category: string
  description: string
  dimensions: string
  capacity: string
  price: string
  price_unit: string
  image: string
  active: boolean
}

function initialState(product: AdminProduct | null, defaultCategory: string): FormState {
  return {
    name: product?.name ?? "",
    category: product?.category ?? defaultCategory,
    description: product?.description ?? "",
    dimensions: product?.dimensions ?? "",
    capacity: product?.capacity ?? "",
    price: product?.price == null ? "" : product.price.toFixed(2).replace(".", ","),
    price_unit: product?.price_unit ?? "",
    image: product?.image ?? "",
    active: product?.active ?? true,
  }
}

export function ProductEditor({
  open,
  product,
  categories,
  defaultCategory,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  product: AdminProduct | null
  categories: AdminCategory[]
  defaultCategory: string
  onOpenChange: (open: boolean) => void
  onSaved: (product: AdminProduct, created: boolean) => void
}) {
  const [initial, setInitial] = useState<FormState>(() => initialState(product, defaultCategory))
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)
  const [processingImage, setProcessingImage] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const next = initialState(product, defaultCategory)
    setInitial(next)
    setForm(next)
    setErrors({})
  }, [open, product, defaultCategory])

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial])
  const isNew = !product

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const requestClose = (nextOpen: boolean) => {
    if (nextOpen) return onOpenChange(true)
    if (saving) return
    if (dirty) return setConfirmDiscard(true)
    onOpenChange(false)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setProcessingImage(true)
    try {
      update("image", await resizeImage(file))
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setProcessingImage(false)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!form.name.trim()) nextErrors.name = "Vul een productnaam in"
    if (!form.category) nextErrors.category = "Kies een categorie"
    if (form.price.trim() && !/^(€\s*)?\d+([.,]\d{1,2})?$/.test(form.price.trim())) {
      nextErrors.price = "Vul een geldige prijs in, bijv. 12,50"
    }
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)

    setSaving(true)
    try {
      const saved = await apiRequest<AdminProduct>(isNew ? "/api/products" : `/api/products/${product.id}`, {
        method: isNew ? "POST" : "PUT",
        body: form,
      })
      toast.success(isNew ? `"${saved.name}" is toegevoegd` : "Wijzigingen opgeslagen")
      onSaved(saved, isNew)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={requestClose}>
        <SheetContent className="w-full gap-0 bg-canvas p-0 sm:max-w-[560px]">
          <SheetHeader className="border-b border-hairline px-6 py-5">
            <SheetTitle className="font-display text-2xl font-normal text-ink">
              {isNew ? "Nieuw product" : "Product bewerken"}
            </SheetTitle>
            <SheetDescription className="text-ink-70">
              {isNew
                ? "Voeg een item toe aan de collectie op de website."
                : "Wijzigingen zijn direct zichtbaar op de website na opslaan."}
            </SheetDescription>
          </SheetHeader>

          <form id="product-editor" onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto px-6 py-6" noValidate>
            <div>
              <Label className="mb-2 block text-sm text-ink">Afbeelding</Label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {form.image ? (
                <div className="flex items-end gap-4">
                  <div className="relative aspect-[4/5] w-36 overflow-hidden bg-linen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Voorbeeld" className="h-full w-full object-cover" />
                    {processingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-canvas/70">
                        <Loader2 className="h-5 w-5 animate-spin text-ink" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Vervangen
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => update("image", "")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Verwijderen
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    handleFile(e.dataTransfer.files?.[0])
                  }}
                  className={cn(
                    "flex w-full flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors",
                    dragging ? "border-gold-ink bg-linen" : "border-sand bg-surface hover:bg-linen/60",
                  )}
                >
                  {processingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-ink-55" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ink-55" />
                  )}
                  <span className="text-sm font-medium text-ink">
                    {processingImage ? "Foto verwerken…" : "Sleep een foto hierheen of klik om te kiezen"}
                  </span>
                  <span className="text-xs text-ink-55">
                    Staand formaat (4:5) werkt het mooist. Grote foto&apos;s worden automatisch verkleind.
                  </span>
                </button>
              )}
            </div>

            <div>
              <Label htmlFor="product-name" className="mb-2 block text-sm text-ink">
                Productnaam
              </Label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="bijv. Chiavari stoel goud"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                maxLength={120}
                autoFocus={isNew}
              />
              {errors.name && (
                <p id="product-name-error" className="mt-1.5 text-xs text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="product-category" className="mb-2 block text-sm text-ink">
                Categorie
              </Label>
              <Select value={form.category} onValueChange={(value) => update("category", value)}>
                <SelectTrigger
                  id="product-category"
                  className="w-full"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Kies een categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                      {!category.active && <span className="text-ink-55"> (verborgen)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="mt-1.5 text-xs text-destructive">{errors.category}</p>}
              {categories.length === 0 && (
                <p className="mt-1.5 text-xs text-ink-55">Maak eerst een categorie aan onder Categorieën.</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <Label htmlFor="product-description" className="text-sm text-ink">
                  Beschrijving
                </Label>
                <span className="text-xs tabular-nums text-ink-55">{form.description.length}/2000</span>
              </div>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Wat maakt dit item bijzonder? Materiaal, kleur, sfeer…"
                rows={4}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="product-dimensions" className="mb-2 block text-sm text-ink">
                  Afmetingen <span className="font-normal text-ink-55">(optioneel)</span>
                </Label>
                <Input
                  id="product-dimensions"
                  value={form.dimensions}
                  onChange={(e) => update("dimensions", e.target.value)}
                  placeholder="40 x 40 x 92 cm"
                  maxLength={120}
                />
              </div>
              <div>
                <Label htmlFor="product-capacity" className="mb-2 block text-sm text-ink">
                  Capaciteit <span className="font-normal text-ink-55">(optioneel)</span>
                </Label>
                <Input
                  id="product-capacity"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="8 personen"
                  maxLength={120}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="product-price" className="mb-2 block text-sm text-ink">
                  Huurprijs in € <span className="font-normal text-ink-55">(optioneel)</span>
                </Label>
                <Input
                  id="product-price"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="12,50"
                  inputMode="decimal"
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "product-price-error" : "product-price-hint"}
                  maxLength={12}
                />
                {errors.price ? (
                  <p id="product-price-error" className="mt-1.5 text-xs text-destructive">
                    {errors.price}
                  </p>
                ) : (
                  <p id="product-price-hint" className="mt-1.5 text-xs text-ink-55">
                    Leeg laten toont &ldquo;Prijs op aanvraag&rdquo;.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="product-price-unit" className="mb-2 block text-sm text-ink">
                  Prijs geldt <span className="font-normal text-ink-55">(optioneel)</span>
                </Label>
                <Input
                  id="product-price-unit"
                  value={form.price_unit}
                  onChange={(e) => update("price_unit", e.target.value)}
                  placeholder="per stuk"
                  maxLength={40}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border border-hairline bg-surface p-4">
              <div>
                <Label htmlFor="product-active" className="text-sm text-ink">
                  Zichtbaar op de website
                </Label>
                <p className="mt-0.5 text-xs text-ink-55">
                  Verborgen producten blijven bewaard maar zijn niet te zien voor bezoekers.
                </p>
              </div>
              <Switch
                id="product-active"
                checked={form.active}
                onCheckedChange={(checked) => update("active", checked)}
              />
            </div>
          </form>

          <div className="flex items-center justify-end gap-2 border-t border-hairline bg-surface px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => requestClose(false)} disabled={saving}>
              Annuleren
            </Button>
            <Button type="submit" form="product-editor" disabled={saving || processingImage}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isNew ? "Product toevoegen" : "Opslaan"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wijzigingen verwerpen?</AlertDialogTitle>
            <AlertDialogDescription>
              U heeft wijzigingen die nog niet zijn opgeslagen. Als u doorgaat, gaan deze verloren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Verder bewerken</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDiscard(false)
                onOpenChange(false)
              }}
            >
              Verwerpen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
