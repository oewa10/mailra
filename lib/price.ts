const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" })

/** "€ 12,50" */
export function formatPrice(price: number) {
  return euro.format(price)
}

/** "€ 12,50 per stuk", or null when the product has no public price. */
export function priceLabel(product: { price: number | null; price_unit: string }) {
  if (product.price == null) return null
  return [formatPrice(product.price), product.price_unit].filter(Boolean).join(" ")
}
