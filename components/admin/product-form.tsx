"use client"

import { useState } from "react"
import { Product, categories } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Product | Omit<Product, "id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id"> & { id?: string }>({
    id: product?.id,
    name: product?.name || "",
    category: product?.category || "stoelen",
    description: product?.description || "",
    dimensions: product?.dimensions || "",
    capacity: product?.capacity || "",
    image: product?.image || "",
  })

  const [imagePreview, setImagePreview] = useState<string>(product?.image || "")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category) {
      alert("Vul alle verplichte velden in")
      return
    }
    
    if (product?.id) {
      onSubmit({ ...formData, id: product.id } as Product)
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Productnaam *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="bijv. Chiavari Stoel"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categorie *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Beschrijving
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Beschrijf het product..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Afmetingen
          </label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="bijv. 40 x 40 x 92 cm"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Capaciteit
          </label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="bijv. 8 personen"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Afbeelding
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg mx-auto"
              />
              <label className="cursor-pointer">
                <span className="text-sm text-primary hover:underline">
                  Klik om afbeelding te wijzigen
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Klik om afbeelding te uploaden
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full"
        >
          Annuleren
        </Button>
        <Button type="submit" className="rounded-full">
          {product ? "Opslaan" : "Product Toevoegen"}
        </Button>
      </div>
    </form>
  )
}
