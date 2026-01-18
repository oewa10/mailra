"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products as initialProducts, Product } from "@/lib/products"
import { ProductForm } from "@/components/admin/product-form"
import { ProductTable } from "@/components/admin/product-table"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = (newProduct: Omit<Product, "id"> | Product) => {
    if ("id" in newProduct && newProduct.id) {
      // Update existing
      setProducts(
        products.map((p) => (p.id === newProduct.id ? (newProduct as Product) : p))
      )
    } else {
      // Add new
      const id = `${newProduct.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
      setProducts([...products, { ...newProduct, id } as Product])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    handleAddProduct(updatedProduct)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Weet u zeker dat u dit product wilt verwijderen?")) {
      setProducts(products.filter((p) => p.id !== id))
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
          <input
            type="text"
            placeholder="Zoeken op naam of categorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  )
}
