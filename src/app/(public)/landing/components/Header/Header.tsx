'use client'

import { useState } from 'react'
import { Search, Menu, ShoppingCart, ChevronDown, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'

interface HeaderProps {
    onCartClick: () => void
}

export default function Header({ onCartClick }: HeaderProps) {
    const [isOpenCurrency, setIsOpenCurrency] = useState(false)
    const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="py-2">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </button>
                            <div className="relative w-full">
                                <Image
                                    src="/assets/logo_wison.webp"
                                    alt="Logo Wilson"
                                    width={80}
                                    height={80}
                                />
                                {/* <h2 className="text-2xl font-bold  ">Tienda Simple</h2> */}
                            </div>
                        </div>

                        <div className="flex-1 max-w-md">

                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpenCurrency(!isOpenCurrency)}
                                    className="flex items-center px-3 py-2  rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <span className="mr-2">
                                        <span className={`fi fi-${currentCurrency.flagCode}`} />
                                    </span>
                                    <span className="hidden sm:inline">{currentCurrency.name}</span>
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </button>
                                {isOpenCurrency && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {currencies.map((currency, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setCurrentCurrency(currency)
                                                        setIsOpenCurrency(false)
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                    role="menuitem"
                                                >
                                                    <span className="mr-2">
                                                        <span className={`fi fi-${currency.flagCode}`} />
                                                    </span>
                                                    {currency.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
{/* 
                            <button
                                onClick={onCartClick}
                                className="hidden md:flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Carrito
                            </button> */}
                            <Link
                                href="/login"
                                className="flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
                            >
                                <User className="h-5 w-5 mr-2" />
                                Mi cuenta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}