import React from 'react'

interface Attribute {
    id: number
    qty: number
    qtyBellowMin: number
}

interface EnhancedStockStatusProps {
    qty: number
    qtyBellowMin: number
    attributes?: Attribute[]
}

export default function EnhancedStockStatus({ qty, qtyBellowMin, attributes }: EnhancedStockStatusProps) {
    const getTotalQty = () => {
        if (attributes && attributes.length > 0) {
            return attributes.reduce((total, attr) => total + attr.qty, 0)
        }
        return qty
    }

    const totalQty = getTotalQty()

    const getStockStatus = () => {
        if (totalQty > qtyBellowMin) {
            return { text: 'En Stock', className: 'bg-green-500 text-white' }
        } else if (totalQty === qtyBellowMin) {
            return { text: 'Pocas Existencias', className: 'bg-yellow-500 text-black' }
        } else {
            return { text: 'Sin Stock', className: 'bg-red-500 text-white' }
        }
    }

    const { text, className } = getStockStatus()

    return (
        <span
            className={`px-2 py-1 rounded-full font-semibold text-xs ${className}`}
        >
            {text}
        </span>
    )
}