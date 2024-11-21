import { getProductsWithPaginationSort } from '@/services/landing-services'
import React, { useEffect, useState } from 'react'
import Pagination from './Module/Pagination/Pagination'
import Loading from '@/components/Ui/Loading'
import { Search } from 'lucide-react'
import Filters from './Module/Filters/Filters'
import ProductGrid from './Module/Products/ProductGrid'

export default function EcommercePage() {
    const [toggleView, setToggleView] = useState(true)
    const [showWholesale, setShowWholesale] = useState(false)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<any>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(16)
    const [totalPages, setTotalPages] = useState(0)
    const [sortType, setSortType] = useState('default')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');

    const handleBrandChange = (brandIds: number[]) => {
        setSelectedBrands(brandIds);
        setCurrentPage(1); // Reset pagination when brands change
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const response = await getProductsWithPaginationSort({
                currentPage,
                itemsPerPage,
                sortType,
                search: searchTerm, // Asegúrate de que `search` sea el término de búsqueda
                brands: selectedBrands,
                state: selectedState
            })

            if (response) {
                setProducts(response.products)
                setTotalPages(response.totalPages)
            }

            setLoading(false)
        }

        fetchProducts()
    }, [currentPage, itemsPerPage, sortType, searchTerm, selectedBrands, selectedState])

    const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber)
    }

    const handleSortChange = (newSortType: React.SetStateAction<string>) => {
        setSortType(newSortType)
        setCurrentPage(1) // Reinicia la paginación cuando cambie el orden
    }

    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reinicia a la primera página en cada nueva búsqueda
    }

    const handleStateChange = (state: string) => {
        setSelectedState(state);
        setCurrentPage(1);
    };

    return <><section className="py-8md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div className="bg-gray-50 antialiased dark:bg-gray-900 p-2 rounded-lg shadow">
                <div className="items-center justify-between space-y-4 sm:flex sm:space-y-0">
                    {/* Buscador */}
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Buscar por nombre,marca, categoría..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <Filters
                        toggleView={toggleView}
                        setToggleView={setToggleView}
                        onSortChange={handleSortChange}
                        onBrandChange={handleBrandChange}
                        onStateChange={handleStateChange}
                        selectedBrands={selectedBrands}
                        selectedState={selectedState}
                        setShowWholesale={setShowWholesale}
                        showWholesale={showWholesale} />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {loading ? (
                <Loading />
            ) : toggleView ? (
                <div className="mb-4 mt-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                    <ProductGrid
                        products={products}
                        totalPages={totalPages}
                        showWholesale={showWholesale}
                    />
                </div>
            ) : (
                <div className="mb-4 mt-4 flex flex-col gap-4">
                    {/* <ProductList
                        products={products}
                        totalPages={totalPages}
                        showWholesale={showWholesale}
                    /> */}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    </section></>
}