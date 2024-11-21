import React, { useEffect, useState, useCallback } from 'react'
import { getBrands } from '@/services/products-service'
import { ChevronDown, Filter, Grid, List, Sliders, X, Search, Check, Tags, ArrowDownZA, ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { formatStatus } from '@/utils/formatUtils';

interface Brand {
    id: number;
    name: string;
    description: string;
    picture: string | null;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FiltersProps {
    toggleView: boolean;
    setToggleView: (view: boolean) => void;
    onSortChange: (sortType: string) => void;
    onBrandChange: (brandIds: number[]) => void;
    onStateChange: (state: string) => void;
    selectedBrands: number[];
    selectedState: string;
    setShowWholesale: (show: boolean) => void;
    showWholesale: boolean;
}

const Filters: React.FC<FiltersProps> = ({
    toggleView,
    setToggleView,
    onSortChange,
    onBrandChange,
    onStateChange,
    selectedBrands,
    selectedState,
    setShowWholesale,
    showWholesale
}) => {
    const [openDropdown, setOpenDropdown] = useState<'sort' | 'brands' | 'state' | null>(null)
    const [brands, setBrands] = useState<Brand[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

    useEffect(() => {
        const fetchBrands = async () => {
            const response = await getBrands()
            setBrands(response)
            setFilteredBrands(response)
        }
        fetchBrands()
    }, [])

    const handleDropdownToggle = useCallback((dropdown: 'sort' | 'brands' | 'state') => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown)
    }, [openDropdown])

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (!(event.target as Element).closest('.dropdown-container')) {
            setOpenDropdown(null)
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [handleClickOutside])

    const handleBrandToggle = (brandId: number) => {
        const updatedBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId]
        onBrandChange(updatedBrands)
    }

    const clearBrandSelection = () => {
        onBrandChange([])
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)
        const filtered = brands.filter(brand =>
            brand.name.toLowerCase().includes(term)
        )
        setFilteredBrands(filtered)
    }

    const handleStateChange = useCallback((state: string) => {
        onStateChange(state)
        setOpenDropdown(null)
    }, [onStateChange])

    const clearStateSelection = () => {
        onStateChange('')
        setOpenDropdown(null)
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Brand filter */}
            <div className="relative inline-flex align-middle dropdown-container">
                <button
                    onClick={() => handleDropdownToggle('brands')}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'brands'}
                >
                    <Tags className="-ml-1 mr-2 h-4 w-4" />
                    {selectedBrands.length > 0
                        ? `${selectedBrands.length} marca${selectedBrands.length > 1 ? 's' : ''} seleccionada${selectedBrands.length > 1 ? 's' : ''}`
                        : 'Marcas'}
                    <ChevronDown className="-mr-1 ml-2 h-4 w-4" />
                </button>

                {openDropdown === 'brands' && (
                    <div className="z-50 absolute mt-10 w-64 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                        <div className="p-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-2 pl-8 pr-3 text-sm border rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                                    placeholder="Buscar marcas..."
                                    aria-label="Buscar marcas"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <ul className="p-3 space-y-1 max-h-60 overflow-auto">
                            {filteredBrands.map((brand) => (
                                <li key={brand.id} className="py-1">
                                    <button
                                        onClick={() => handleBrandToggle(brand.id)}
                                        className="w-full px-3 py-2 flex items-center justify-between rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {brand.name}
                                        </span>
                                        {selectedBrands.includes(brand.id) && (
                                            <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {selectedBrands.length > 0 && (
                            <div className="p-3">
                                <button
                                    onClick={clearBrandSelection}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Limpiar selección
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* State filter */}
            <div className="relative inline-flex align-middle dropdown-container">
                <button
                    onClick={() => handleDropdownToggle('state')}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'state'}
                >
                    <Filter className="-ml-1 mr-2 h-4 w-4" />
                    {formatStatus(selectedState)}
                    <ChevronDown className="-mr-1 ml-2 h-4 w-4" />
                </button>

                {openDropdown === 'state' && (
                    <div className="z-50 absolute mt-10 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                        <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="state-menu">
                            {['new', 'used', 'refurbished'].map((state) => (
                                <li key={state}>
                                    <button
                                        onClick={() => handleStateChange(state)}
                                        className="w-full px-3 py-2 flex items-center justify-between rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        role="menuitem"
                                    >
                                        {state === 'new' ? 'Nuevo' : state === 'used' ? 'Usado' : 'Reacondicionado'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {selectedState && (
                            <div className="p-2">
                                <button
                                    onClick={clearStateSelection}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Limpiar selección
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sort button */}
            <div className="relative inline-flex align-middle dropdown-container">
                <button
                    onClick={() => handleDropdownToggle('sort')}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'sort'}
                >
                    {openDropdown === 'sort' ? <ArrowUpAZ className="h-4 w-4 -ml-1 mr-2" /> : <ArrowDownZA className="h-4 w-4 -ml-1 mr-2" />}
                    Ordenar
                    <span
                        className={`ml-2 transform transition-transform duration-300 ${openDropdown === 'sort' ? 'rotate-180' : 'rotate-0'}`}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </button>

                {openDropdown === 'sort' && (
                    <div className="z-50 absolute mt-10 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                        <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu">
                            {[
                                { key: 'priceAsc', label: 'Menor Precio' },
                                { key: 'priceDesc', label: 'Mayor Precio' },
                                { key: 'nameAsc', label: 'A-Z' },
                                { key: 'nameDesc', label: 'Z-A' },
                                { key: 'bestSellers', label: 'Más Vendidos' },
                            ].map((option) => (
                                <li key={option.key}>
                                    <button
                                        onClick={() => {
                                            onSortChange(option.key)
                                            setOpenDropdown(null)
                                        }}
                                        className="w-full px-3 py-2 flex items-center justify-between rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        role="menuitem"
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                    </div>
                )}
            </div>

            {/* Toggle view button */}
            <div className="relative inline-flex align-middle">
                {/* <button
                    onClick={() => setToggleView(!toggleView)}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 transition-all duration-300"
                    aria-label={toggleView ? "Cambiar a vista de cuadrícula" : "Cambiar a vista de lista"}
                >
                    {toggleView ? (
                        <List className="h-4 w-4" />
                    ) : (
                        <Grid className="h-4 w-4" />
                    )}
                </button> */}
            </div>
        </div>
    )
}

export default Filters