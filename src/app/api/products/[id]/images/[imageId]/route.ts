import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string; imageId: string } }
) {
  try {
    const productId = parseInt(params.productId)
    const imageId = parseInt(params.imageId)

    // Get the image details
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete the image file
    const filePath = path.join(process.cwd(), 'public', image.url)
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
