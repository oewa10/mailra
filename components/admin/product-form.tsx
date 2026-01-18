"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface Category {
  id: string
  name: string
  active?: boolean
}

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Product | Omit<Product, "id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "id"> & { id?: string }>({
    id: product?.id,
    name: product?.name || "",
    category: product?.category || "",
    description: product?.description || "",
    dimensions: product?.dimensions || "",
    capacity: product?.capacity || "",
    image: product?.image || "",
  })

  const [imagePreview, setImagePreview] = useState<string>(product?.image || "")
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Fetch categories from database on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        // Set default category if not set
        if (!formData.category && data.length > 0) {
          setFormData((prev) => ({ ...prev, category: data[0].id }))
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setCategoriesLoading(false)
    }
  }

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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Product name and category - stacked on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Productnaam *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="bijv. Chiavari Stoel"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Categorie *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base appearance-none"
            required
            disabled={categoriesLoading}
          >
            <option value="">
              {categoriesLoading ? "Categorieën laden..." : "Selecteer een categorie"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description - full width */}
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          Beschrijving
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Beschrijf het product..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
        />
      </div>

      {/* Dimensions and capacity - stacked on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Afmetingen
          </label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="bijv. 40 x 40 x 92 cm"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Capaciteit
          </label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="bijv. 8 personen"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
        </div>
      </div>

      {/* Image upload - optimized for touch */}
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          Afbeelding
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-lg mx-auto"
              />
              <label className="cursor-pointer inline-block py-2 px-4 bg-secondary/50 rounded-lg hover:bg-secondary">
                <span className="text-sm font-medium text-primary">
                  Wijzig afbeelding
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
            <label className="cursor-pointer block py-8 hover:bg-secondary/20 rounded-lg transition-colors">
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <span className="text-base text-muted-foreground">
                  Tik om afbeelding te uploaden
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

      {/* Form buttons - full width on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-full py-3 px-6"
        >
          Annuleren
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:w-auto rounded-full py-3 px-6"
        >
          {product ? "Opslaan" : "Product Toevoegen"}
        </Button>
      </div>
    </form>
  )
}
