import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface BasicUser {
  id: number
  name: string | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ customers: [] })
  }

  try {
    const customers: BasicUser[] = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: query } }],
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error searching customers:', error)
    return NextResponse.json(
      { error: 'An error occurred while searching for customers' },
      { status: 500 }
    )
  }
}
