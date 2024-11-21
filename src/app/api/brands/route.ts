import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany()
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    // Parse the FormData
    const formData = await request.formData()
    const brandData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') === 'true',
    }

    const image = formData.get('images') as File

    // Create the brand first
    const newBrand = await prisma.brand.create({
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

      // Update the brand with the image URL
      await prisma.brand.update({
        where: { id: newBrand.id },
        data: {
          picture: `/uploads/brands/${filename}`,
        },
      })
    }

    // Fetch the updated brand data
    const createdBrand = await prisma.brand.findUnique({
      where: { id: newBrand.id },
    })

    return NextResponse.json(createdBrand)
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand', details: (error as Error).message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
