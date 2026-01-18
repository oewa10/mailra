"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  description: string
  active?: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert("Vul de categorienaam in")
      return
    }

    setActionLoading("submit")
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch(`/api/categories?id=${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          const updated = await response.json()
          setCategories(
            categories.map((c) => (c.id === editingCategory.id ? updated : c))
          )
        }
      } else {
        // Create new category
        const newId = formData.name.toLowerCase().replace(/\s+/g, "-")
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newId, ...formData, active: true }),
        })
        if (response.ok) {
          const created = await response.json()
          setCategories([...categories, created])
        }
      }
      handleCloseForm()
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Weet u zeker dat u deze categorie wilt verwijderen?")) {
      setActionLoading(id)
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setCategories(categories.filter((c) => c.id !== id))
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleToggleActive = async (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return

    const newStatus = !category.active
    const productCount = 0 // We'll show this in the warning

    if (
      !confirm(
        `Weet u zeker dat u deze categorie en alle bijbehorende producten ${
          newStatus ? "activeren" : "deactiveren"
        } wilt?`
      )
    ) {
      return
    }

    setActionLoading(id)
    try {
      const response = await fetch(`/api/categories/${id}/toggle-active`, {
        method: "PATCH",
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategories(
          categories.map((c) => (c.id === id ? updatedCategory : c))
        )
      }
    } catch (error) {
      console.error("Error toggling category active status:", error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground">Categorieën</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">
              {categories.length} categorieën in totaal
            </p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="w-full sm:w-auto rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Categorie
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 sm:mb-8 bg-card rounded-lg border border-border p-4 sm:p-6">
            <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">Geen categorieën gevonden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        category.active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}>
                        {category.active ? "Actief" : "Inactief"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {category.description || "Geen beschrijving"}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(category.id)}
                    disabled={actionLoading === category.id}
                    className="w-full sm:flex-1 rounded-lg py-2"
                  >
                    {actionLoading === category.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : category.active ? (
                      <Eye className="h-4 w-4 mr-2" />
                    ) : (
                      <EyeOff className="h-4 w-4 mr-2" />
                    )}
                    <span>{category.active ? "Deactiveren" : "Activeren"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenForm(category)}
                    className="w-full sm:flex-1 rounded-lg py-2"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Bewerken
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={actionLoading === category.id}
                    className="w-full sm:flex-1 rounded-lg py-2 text-destructive hover:text-destructive"
                  >
                    {actionLoading === category.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Verwijderen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
