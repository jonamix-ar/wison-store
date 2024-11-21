import React from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types/products'

interface ProductGridProps {
    products: Product[];
    showWholesale: boolean;
    totalPages?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products = [], showWholesale }) => {
    return (
        <>
            {products.map((product: Product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    showWholesale={showWholesale}
                />
            ))}
        </>
    )
}

export default ProductGrid