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
    setLoading(true)
    try {
      console.log("Fetching products from database...")
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        console.log(`Fetched ${data.length} products from database`)
        setProducts(data)
      } else {
        console.error("Failed to fetch products:", response.status)
        alert("Er is een fout opgetreden bij het ophalen van producten.")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Er is een fout opgetreden bij het ophalen van producten.")
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
      console.log(`Toggling product with ID: ${id}`)
      
      const response = await fetch(`/api/products/${id}/toggle-active`, {
        method: "PATCH",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Error toggling product (${response.status}):`, errorData.error)
        
        if (response.status === 404) {
          if (confirm(`Product met ID ${id} niet gevonden in de database. Wilt u de pagina vernieuwen om de laatste gegevens te laden?`)) {
            // Refresh the products data
            await fetchProducts()
          }
        } else {
          alert(`Fout bij het wijzigen van productstatus: ${errorData.error || 'Onbekende fout'}`)
        }
        return
      }
      
      const data = await response.json()
      console.log('Product toggle successful:', data)
      
      // Update the product in the local state
      setProducts(
        products.map((p) => (p.id === id ? data : p))
      )
    } catch (error) {
      console.error("Error toggling product active status:", error)
      alert("Fout bij het wijzigen van productstatus. Controleer de console voor meer details.")
      // Refresh products data to ensure consistency
      await fetchProducts()
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
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground">Producten</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">
              {products.length} producten in totaal
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="w-full sm:w-auto rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Product
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 sm:mb-8 bg-card rounded-lg border border-border p-4 sm:p-6">
            <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              {editingProduct ? "Product Bewerken" : "Nieuw Product"}
            </h2>
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Zoeken op naam of categorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
            {selectedIds.size > 0 && (
              <Button
                onClick={handleBulkDelete}
                disabled={actionLoading === "bulk-delete"}
                variant="destructive"
                className="w-full sm:w-auto rounded-lg py-2 px-4"
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
