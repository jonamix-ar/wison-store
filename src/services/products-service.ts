import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export const getCategories = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.CATEGORIES_INDEX)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const getCategory = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.CATEGORY_VIEW(id))
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const createCategory = async (data: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.CATEGORY_CREATE, data)
    return response.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export const editCategory = async (data: any, id: number) => {
  try {
    const response = await axios.put(API_ENDPOINTS.CATEGORY_EDIT(id), data)
    return response.data
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export const deleteCategory = async (id: number) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.CATEGORY_DELETE(id))
    return response.data
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

export const getBrands = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.BRANDS_INDEX)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const getBrand = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.BRAND_VIEW(id))
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const createBrand = async (data: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.BRAND_CREATE, data)
    return response.data
  } catch (error) {
    console.error('Error creating brand:', error)
    throw error
  }
}

export const updateBrand = async (id: string, formData: FormData) => {
  const response = await axios.put(`/api/brands/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteBrand = async (id: number) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.BRAND_DELETE(id))
    return response.data
  } catch (error) {
    console.error('Error deleting brand:', error)
    throw error
  }
}

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCTS_INDEX)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const getProduct = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PRODUCT_VIEW(id))
    return response // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PRODUCT_CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const editProduct = async (data: any, id: number) => {
  try {
    const response = await axios.put(API_ENDPOINTS.PRODUCT_EDIT(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Server response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating product:', error)

    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.error || 'Failed to update product'
      throw new Error(errorMessage)
    }

    throw new Error('An unexpected error occurred')
  }
}

export const deleteProduct = async (id: number) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.PRODUCT_DELETE(id))
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data)
        if (error.response.status === 409) {
          throw new Error(
            error.response.data.error ||
              'Cannot delete product due to existing references'
          )
        }
        throw new Error(error.response.data.error || 'Failed to delete product')
      } else if (error.request) {
        console.error('No response received:', error.request)
        throw new Error('No response received from server')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error('Error setting up request')
      }
    } else {
      console.error('Non-Axios error:', error)
      throw new Error('An unexpected error occurred')
    }
  }
}

export const deleteProductImage = async (
  id: number,
  imageId: number
): Promise<void> => {
  try {
    const response = await fetch(`/api/products/${id}/images/${imageId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error('Error in deleteProductImage:', error)
    throw error
  }
}
