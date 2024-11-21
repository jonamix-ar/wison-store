import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { brandId: string; imageId: string } }
) {
  try {
    const brandId = parseInt(params.brandId)
    const imageId = parseInt(params.imageId)

    // Get the image details
    const image = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete the image file
    const filePath = path.join(process.cwd(), 'public', image.picture)
    await fs.unlink(filePath)

    // Delete the image record from the database
    await prisma.productImage.delete({
      where: { id: imageId },
    })

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting product image:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
