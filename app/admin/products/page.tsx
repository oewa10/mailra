"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/products"
import { ProductForm } from "@/components/admin/product-form"
import { ProductTable } from "@/components/admin/product-table"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch products from database on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = async (newProduct: Omit<Product, "id"> | any) => {
    try {
      if ("id" in newProduct && newProduct.id) {
        // Update existing product
        const response = await fetch(`/api/products/${newProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        })
        if (response.ok) {
          const updated = await response.json()
          setProducts(products.map((p) => (p.id === newProduct.id ? updated : p)))
        }
      } else {
        // Create new product
        const id = `${newProduct.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
        const productToCreate = { ...newProduct, id }
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToCreate),
        })
        if (response.ok) {
          const created = await response.json()
          setProducts([...products, created])
        }
      }
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleUpdateProduct = (updatedProduct: any) => {
    handleAddProduct(updatedProduct)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Weet u zeker dat u dit product wilt verwijderen?")) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setProducts(products.filter((p) => p.id !== id))
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleToggleActive = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/products/${id}/toggle-active`, {
        method: "PATCH",
      })
      
      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(
          products.map((p) => (p.id === id ? updatedProduct : p))
        )
      }
    } catch (error) {
      console.error("Error toggling product active status:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Weet u zeker dat u ${selectedIds.size} product(en) wilt verwijderen?`)) return

    setActionLoading("bulk-delete")
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/products?id=${id}`, { method: "DELETE" })
      )
      await Promise.all(deletePromises)
      setProducts(products.filter((p) => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
    } catch (error) {
      console.error("Error deleting products:", error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="flex-1 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Producten</h1>
            <p className="text-muted-foreground mt-2">
              {products.length} producten in totaal
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Product
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 bg-card rounded-lg border border-border p-6">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              {editingProduct ? "Product Bewerken" : "Nieuw Product"}
            </h2>
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Zoeken op naam of categorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {selectedIds.size > 0 && (
              <Button
                onClick={handleBulkDelete}
                disabled={actionLoading === "bulk-delete"}
                variant="destructive"
                className="rounded-lg"
              >
                {actionLoading === "bulk-delete" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Verwijder {selectedIds.size}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          onToggleActive={handleToggleActive}
          selectedIds={selectedIds}
          onSelectProduct={handleSelectProduct}
          onSelectAll={handleSelectAll}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  )
}
