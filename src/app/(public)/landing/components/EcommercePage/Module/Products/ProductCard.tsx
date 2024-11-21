import React from 'react'
import { useCurrency } from '@/context/CurrencyContext'
import Link from 'next/link'
import Image from 'next/image'
import { formatStatusMobile } from '@/utils/formatUtils'
import { Product } from '@/types/products'

interface Attribute {
    id: number
    productId: number
    name: string
    value: string
    qty: number
    price: string
    priceWholesaler: string
}

interface ProductCardProps {
    product: Product;
    showWholesale: boolean;
    list?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showWholesale, list }) => {
    const imagePlaceholder = "/assets/placeholder.svg"
    const { convertPrice, currentCurrency } = useCurrency()

    const formatPrice = (price: number) => {
        const convertedPrice = convertPrice(price)
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currentCurrency.code,
            currencyDisplay: 'symbol'
        }).format(convertedPrice)
    }

    return (
        <div
            className={`${list
                    ? 'flex items-center space-x-6 p-4'
                    : 'flex flex-col p-6'
                } rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800`}
        >
            <div className={`${list ? 'w-24 h-24' : 'w-full aspect-square'} mb-4 relative overflow-hidden`}>
                <Link href={`/producto/${product.slug}`}>
                    <Image
                        src={product?.productImage?.length > 0 ? `${process.env.NEXT_PUBLIC_BASE_URL}${product.productImage[0].url}` : imagePlaceholder}
                        alt={product?.name}
                        title={product?.name}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                    />
                </Link>
            </div>
            <div className={`${list ? 'flex-1' : 'text-center'}`}>
                <Link
                    href={`/producto/${product.slug}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                >
                    {product.name}
                </Link>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.brand.name}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {product.category.name}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {formatStatusMobile(product.state)}
                    </span>
                    <span className={`${product.qty > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {product.qty > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Precio
                    </p>
                    <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                        {formatPrice(parseFloat(product?.attributes?.length > 0 ? product.attributes[0].price : product.price))}
                    </p>
                </div>
                {product?.attributes?.length > 0 && (
                    <div className="mt-2">
                        <label htmlFor={`attribute-${product.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Variantes
                        </label>
                        <select
                            id={`attribute-${product.id}`}
                            className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {product?.attributes.map((attr: Attribute, attrIndex: number) => (
                                <option key={attrIndex} value={attr.id}>
                                    {attr.value} - {formatPrice(parseFloat(attr.price))}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard