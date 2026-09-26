export type AdminProduct = {
  id: string
  name: string
  category: string
  description: string
  dimensions: string
  capacity: string
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
