export interface Product {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  categoryId: string
  category: Category
  brandId: string
  brand: Brand
  productImage: ProductImage[]
  createdAt: string
  updatedAt: string
  attributes: ProductAttribute[]
  cost: number
  promotionalPrice: number
  qty: number
  qtyBellowMin: number
  showPrice: boolean
  showWholesalePrice: boolean
  status: boolean
  state: string
}

export type ViewMode = 'list' | 'grid'

export interface Category {
  id: number
  name: string
  description: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: number
  name: string
  description: string
  picture: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: number
  productId: number
  url: string
  order: number
  createdAt: Date
  updatedAt: Date
}
