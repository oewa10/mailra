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

  // Responsive table/card view
  return (
    <div>
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
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

      {/* Mobile Card View - Shown only on Mobile */}
      <div className="md:hidden space-y-4">
        {/* Select All Checkbox for Mobile */}
        <div className="flex items-center px-4 py-3 bg-secondary rounded-lg mb-2">
          <input
            type="checkbox"
            checked={selectedIds.size > 0 && selectedIds.size === products.length}
            onChange={onSelectAll}
            className="rounded border-border mr-3"
            id="select-all-mobile"
          />
          <label htmlFor="select-all-mobile" className="text-sm font-medium">
            Selecteer alle producten
          </label>
        </div>

        {/* Product Cards */}
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
          >
            {/* Card Header with Checkbox */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => onSelectProduct?.(product.id)}
                  className="rounded border-border mr-3"
                />
                <h3 className="font-medium text-foreground">{product.name}</h3>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                product.active
                  ? "bg-green-500/10 text-green-600"
                  : "bg-gray-500/10 text-gray-600"
              }`}>
                {product.active ? "Actief" : "Inactief"}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      Geen afb.
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Geen beschrijving"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {product.category}
                    </span>
                    
                    {product.dimensions && (
                      <span className="text-xs text-muted-foreground">
                        {product.dimensions}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleActive(product.id)}
                  disabled={actionLoading === product.id}
                  className="rounded-lg flex-1 mr-2"
                >
                  {actionLoading === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : product.active ? (
                    <Eye className="h-4 w-4 mr-2" />
                  ) : (
                    <EyeOff className="h-4 w-4 mr-2" />
                  )}
                  <span>{product.active ? "Deactiveren" : "Activeren"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="rounded-lg flex-1 mr-2"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  <span>Bewerken</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                  className="rounded-lg flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Verwijderen</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
