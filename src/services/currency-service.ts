import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export interface Currency {
  id: number
  code: string
  flagCode: string
  name: string
  symbol: string
  rate: number
  apiUrl: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export async function getAllCurrencies(): Promise<Currency[]> {
  try {
    const response = await axios.get<Currency[]>(API_ENDPOINTS.CURRENCIES_INDEX)
    return response.data
  } catch (error) {
    console.error('Error fetching currencies:', error)
    throw error
  }
}

export async function updateCurrencyRate(
  code: string,
  rate: number
): Promise<Currency> {
  try {
    const response = await axios.post<Currency>(
      API_ENDPOINTS.CURRENCIES_INDEX,
      {
        code,
        rate,
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating currency rate:', error)
    throw error
  }
}

export async function fetchAndUpdateRates(): Promise<Currency[]> {
  try {
    const currencies = await getAllCurrencies()
    return await Promise.all(
      currencies.map(async (currency) => {
        if (currency.apiUrl) {
          try {
            const response = await axios.get<ApiResponse>(currency.apiUrl)
            const newRate = response.data.venta
            if (newRate !== currency.rate) {
              return await updateCurrencyRate(currency.code, newRate)
            }
          } catch (error) {
            console.error(`Error updating rate for ${currency.code}:`, error)
          }
        }
        return currency
      })
    )
  } catch (error) {
    console.error('Error fetching and updating rates:', error)
    throw error
  }
}
