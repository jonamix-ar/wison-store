'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchAndUpdateRates } from '@/services/currency-service'
import { toast } from 'react-toastify'

interface Currency {
    id: number
    code: string
    name: string
    symbol: string
    rate: number
    flagCode: string
    apiUrl: string | null
    createdAt: string
    updatedAt: string
}

interface CurrencyContextType {
    currencies: Currency[]
    currentCurrency: Currency
    setCurrentCurrency: (currency: Currency) => void
    convertPrice: (price: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
    const context = useContext(CurrencyContext)
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<Currency>({
        id: 0,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        rate: 1,
        flagCode: 'us',
        apiUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })

    useEffect(() => {
        const updateCurrencies = async () => {
            const updatedCurrencies = await fetchAndUpdateRates()
            setCurrencies(updatedCurrencies)
            if (updatedCurrencies.length > 0) {
                setCurrentCurrency(prev => {
                    return updatedCurrencies.find((c: { code: string }) => c.code === prev.code) || updatedCurrencies[0]
                })
            }
        }

        updateCurrencies()
        const interval = setInterval(updateCurrencies, 60 * 60 * 1000) // Actualiza cada hora

        return () => clearInterval(interval)
    }, [])

    const convertPrice = (price: number) => {

        if (currentCurrency.code === 'USD') {
            // return price + dolarExt
            return price
        } else {
            return currentCurrency.rate * price
        }
    }

    return (
        <CurrencyContext.Provider value={{ currencies, currentCurrency, setCurrentCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}