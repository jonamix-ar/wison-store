import { Product } from '@/types/products'
import axios from 'axios'

interface ProductsResponse {
  products: Product[]
  totalItems: number
  totalPages: number
  currentPage: number
}

interface PaginationParams {
  currentPage: number
  itemsPerPage: number
  sortType: string
  search?: string
  brands?: number[]
  state?: string
}

export const getProductsWithPaginationSort = async ({
  currentPage,
  itemsPerPage,
  sortType,
  search = '',
  brands = [],
  state,
}: PaginationParams): Promise<ProductsResponse | null> => {
  try {
    const brandsFilter = brands.length > 0 ? `&brands=${brands.join(',')}` : ''

    const response = await axios.get<ProductsResponse>(
      `/api/products/pagination?page=${currentPage}&limit=${itemsPerPage}&sort=${sortType}&state=${state?.toLocaleUpperCase()}&search=${encodeURIComponent(
        search
      )}${brandsFilter}`
    )

    return {
      products: response.data.products,
      totalItems: response.data.totalItems,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage || currentPage,
    }
  } catch (error) {
    console.error('Error al obtener los productos con paginación:', error)
    return null
  }
}
