"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories as initialCategories } from "@/lib/products"

interface Category {
  id: string
  name: string
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([...initialCategories])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const handleOpenForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, description: category.description })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", description: "" })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({ name: "", description: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert("Vul de categorienaam in")
      return
    }

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: formData.name, description: formData.description }
            : c
        )
      )
    } else {
      const newId = formData.name.toLowerCase().replace(/\s+/g, "-")
      setCategories([
        ...categories,
        { id: newId, name: formData.name, description: formData.description },
      ])
    }
    handleCloseForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Weet u zeker dat u deze categorie wilt verwijderen?")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="flex-1 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Categorieën</h1>
            <p className="text-muted-foreground mt-2">
              {categories.length} categorieën in totaal
            </p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Categorie
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 bg-card rounded-lg border border-border p-6">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              {editingCategory ? "Categorie Bewerken" : "Nieuwe Categorie"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categorienaam *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="bijv. Stoelen"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Beschrijving
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Beschrijf deze categorie..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="rounded-full"
                >
                  Annuleren
                </Button>
                <Button type="submit" className="rounded-full">
                  {editingCategory ? "Opslaan" : "Categorie Toevoegen"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">ID: {category.id}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {category.description || "Geen beschrijving"}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenForm(category)}
                  className="flex-1 rounded-lg"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Bewerken
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 rounded-lg text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verwijderen
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
