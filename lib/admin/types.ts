export type AdminProduct = {
  id: string
  name: string
  category: string
  description: string
  dimensions: string
  capacity: string
  /** Rental price in euros; null when it isn't shown ("prijs op aanvraag"). */
  price: number | null
  /** What the price is for, e.g. "per stuk" or "per dag"; may be empty. */
  price_unit: string
  image: string
  active: boolean
  created_at: string
  updated_at: string
}

export type AdminCategory = {
  id: string
  name: string
  description: string
  active: boolean
  product_count: number
  active_product_count: number
}

export type AdminStats = {
  products: number
  activeProducts: number
  categories: number
  withoutImage: number
  withoutDescription: number
  hiddenByCategory: number
}
