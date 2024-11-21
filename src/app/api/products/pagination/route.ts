import { NextRequest, NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '15', 10)
    const sort = searchParams.get('sort') || 'default'
    const search = searchParams.get('search') || ''
    const brands = searchParams.get('brands') || ''
    const state = searchParams.get('state') || ''

    const skip = (page - 1) * limit

    const orderBy = getOrderBy(sort)
    const queryConditions = getQueryConditions(search, brands, state)

    const [products, totalItems] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        where: queryConditions,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true },
          },
          brand: {
            select: { id: true, name: true },
          },
          productImage: {
            select: { id: true, url: true },
            take: 1,
          },
        },
      }),
      prisma.products.count({
        where: queryConditions,
      }),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      products: products.map(formatProduct),
      totalItems,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error('Error in GET /api/products/pagination:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

function getOrderBy(sort: string): Prisma.ProductsOrderByWithRelationInput {
  switch (sort) {
    case 'priceAsc':
      return { price: 'asc' }
    case 'priceDesc':
      return { price: 'desc' }
    case 'nameAsc':
      return { name: 'asc' }
    case 'nameDesc':
      return { name: 'desc' }
    case 'bestSellers':
      return { saleDetail: { _count: 'desc' } }
    case 'default':
      return { id: 'asc' }
    default:
      return { createdAt: 'desc' }
  }
}

function getQueryConditions(search: string, brands: string, state: string) {
  const conditions: any = {}

  if (search) {
    const searchLower = search.toLowerCase()
    conditions.OR = [
      { name: { contains: searchLower } },
      { brand: { name: { contains: searchLower } } },
      { category: { name: { contains: searchLower } } },
    ]
  }

  if (brands && brands !== 'all') {
    const brandIds = brands
      .split(',')
      .map(Number)
      .filter((id) => !isNaN(id))
    if (brandIds.length > 0) {
      conditions.brandId = { in: brandIds }
    }
  }

  if (state && ['NEW', 'USED', 'REFURBISHED'].includes(state)) {
    conditions.state = state
  }

  return conditions
}

function formatProduct(product: any) {
  return {
    ...product,
    price: product.price.toNumber(),
    priceWholeSaller: product.priceWholeSaller.toNumber(),
    cost: product.cost.toNumber(),
    promotionalPrice: product.promotionalPrice.toNumber(),
  }
}
