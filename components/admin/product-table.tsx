"use client"

import { Product } from "@/lib/products"
import { Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductTableProps {
  products: any[]
  onEdit: (product: any) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  selectedIds?: Set<string>
  onSelectProduct?: (id: string) => void
  onSelectAll?: () => void
  actionLoading?: string | null
}

export function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  onToggleActive,
  selectedIds = new Set(),
  onSelectProduct,
  onSelectAll,
  actionLoading
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <p className="text-muted-foreground">Geen producten gevonden</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === products.length}
                  onChange={onSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Afbeelding
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Naam
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Categorie
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Afmetingen
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => onSelectProduct?.(product.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  {!product.image || product.image === "" ? (
                    <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      Geen afb.
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {product.dimensions || "-"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.active
                      ? "bg-green-500/10 text-green-600"
                      : "bg-gray-500/10 text-gray-600"
                  }`}>
                    {product.active ? "Actief" : "Inactief"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleActive(product.id)}
                      disabled={actionLoading === product.id}
                      className="rounded-lg"
                      title={product.active ? "Deactiveer product" : "Activeer product"}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : product.active ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="rounded-lg text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
