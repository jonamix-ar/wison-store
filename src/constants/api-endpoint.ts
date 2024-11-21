export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  STATISTICS_DASHBOARD: `${API_BASE_URL}/statistics/dashboard`,
  PRODUCTS_INDEX: `${API_BASE_URL}/products`,
  PRODUCT_CREATE: `${API_BASE_URL}/products`,
  PRODUCT_VIEW: (id: number) => `${API_BASE_URL}/products/${id}`,
  PRODUCT_EDIT: (id: number) => `${API_BASE_URL}/products/${id}`, // Remove '/edit'
  PRODUCT_DELETE: (id: number) => `${API_BASE_URL}/products/${id}`,

  CATEGORIES_INDEX: `${API_BASE_URL}/categories`,
  CATEGORY_CREATE: `${API_BASE_URL}/categories`,
  CATEGORY_VIEW: (id: number) => `${API_BASE_URL}/categories/${id}`,
  CATEGORY_EDIT: (id: number) => `${API_BASE_URL}/categories/${id}`,
  CATEGORY_DELETE: (id: number) => `${API_BASE_URL}/categories/${id}`,

  BRANDS_INDEX: `${API_BASE_URL}/brands`,
  BRAND_CREATE: `${API_BASE_URL}/brands`,
  BRAND_VIEW: (id: number) => `${API_BASE_URL}/brands/${id}`,
  BRAND_EDIT: (id: number) => `${API_BASE_URL}/brands/${id}`,
  BRAND_DELETE: (id: number) => `${API_BASE_URL}/brands/${id}`,

  USERS_INDEX: `${API_BASE_URL}/users`,
  USER_CREATE: `${API_BASE_URL}/users`,
  USER_VIEW: (id: number) => `${API_BASE_URL}/users/${id}`,
  USER_EDIT: (id: number) => `${API_BASE_URL}/users/${id}`,
  USER_DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,

  CURRENCIES_INDEX: `${API_BASE_URL}/currencies`,
}
