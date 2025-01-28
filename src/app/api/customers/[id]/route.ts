import { NextResponse } from 'next/server' // Conect to Prisma
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id, 10)
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        profile: {
          include: {
            country: true,
            state: true,
          },
        },
      },
    })
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    return NextResponse.json(customer, { status: 200 })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Error al obtener el cliente' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id, 10)
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

    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        profile: {
          update: {
            phone: body.phone,
            address: body.address,
            countryId: parseInt(body.country),
            stateId: parseInt(body.states),
            city: body.city,
            cp: body.postalCode,
            document: body.document,
            documentNumber: body.documentNumber,
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

    return NextResponse.json(updatedCustomer, { status: 200 })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      {
        error: 'Error al actualizar el cliente',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
