import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { writeFile } from 'fs/promises'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 })
    }

    const category = await prisma.brand.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const formData = await request.formData()
    const brandData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') === 'true',
    }

    const image = formData.get('images') as File | null

    // Update the brand first
    const updatedBrand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name: brandData.name,
        description: brandData.description,
        status: brandData.status,
      },
    })

    // Handle image upload if an image is provided
    if (image) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'brands')
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create a slug from the brand name
      const slug = brandData.name.toLowerCase().replace(/ /g, '-')

      const filename = `${Date.now()}-${slug}${path.extname(image.name)}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      // Update the brand with the new image URL
      await prisma.brand.update({
        where: { id: updatedBrand.id },
        data: {
          picture: `/uploads/brands/${filename}`,
        },
      })
    }

    // Fetch the updated brand data
    const finalUpdatedBrand = await prisma.brand.findUnique({
      where: { id: updatedBrand.id },
    })

    return NextResponse.json(finalUpdatedBrand)
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Failed to update brand', details: (error as Error).message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
