import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const brandId = parseInt(params.id)
    const imageId = parseInt(params.imageId)

    // Get the brand details
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Check if the brand has a picture
    if (brand.picture) {
      // Delete the image file
      const filePath = path.join(process.cwd(), 'public', brand.picture)
      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.error('Error deleting file:', error)
        // Continue execution even if file deletion fails
      }
    }

    // Delete the brand record from the database
    await prisma.brand.delete({
      where: { id: brandId },
    })

    return NextResponse.json({ message: 'Brand deleted successfully' })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
