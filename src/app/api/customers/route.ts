import { NextResponse } from 'next/server' // Conect to Prisma
import { prisma } from '@/lib/prisma'
import { Prisma, Role } from '@prisma/client'

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.CUSTOMER, Role.WHOLESALER],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          include: {
            country: true,
            state: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.role ||
      !body.country ||
      !body.states
    ) {
      throw new Error(
        'Missing required fields: name, email, role, country, or states'
      )
    }

    const newCustomer = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password ?? '', // Default empty string if undefined
        role: body.role,
        profile: {
          create: {
            phone: body.phone ?? null,
            address: body.address ?? null,
            countryId: parseInt(body.country), // Convert string to integer
            stateId: parseInt(body.states), // Convert string to integer
            city: body.city ?? null,
            cp: body.postalCode ?? null,
            document: body.document ?? null,
            documentNumber: body.documentNumber ?? null,
          },
        },
      },
      include: {
        profile: {
          include: {
            country: true,
            state: true,
          },
        },
      },
    })

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Error al crear el cliente', details: (error as Error).message },
      { status: 500 }
    )
  }
}
