import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Convert status to boolean for Prisma
    const data = {
      ...body,
      status: Boolean(body.status),
    }

    const newCategory = await prisma.category.create({ data })
    return NextResponse.json(newCategory)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
