import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { writeFile } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        productImage: true,
        attributes: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const formData = await request.formData()

    // Helper function to convert FormDataEntryValue to boolean
    const toBool = (value: FormDataEntryValue | null): boolean => {
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true'
      }
      return false
    }

    // Update the main product data
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        categoryId: parseInt(formData.get('categoryId') as string),
        brandId: parseInt(formData.get('brandId') as string),
        qty: parseInt(formData.get('qty') as string),
        qtyBellowMin: parseInt(formData.get('qtyBellowMin') as string),
        price: parseFloat(formData.get('price') as string),
        priceWholeSaller: parseFloat(
          formData.get('priceWholeSaller') as string
        ),
        showPrice: toBool(formData.get('showPrice')),
        showPriceWholeWaller: toBool(formData.get('showPriceWholeWaller')),
        status: toBool(formData.get('status')),
      },
    })

    // Handle image uploads
    const images = formData.getAll('images') as File[]
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const imageUrls = []

    for (const image of images) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${image.name}`
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      imageUrls.push(`/uploads/products/${filename}`)
    }

    if (imageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url) => ({ productId: id, url })),
      })
    }

    // Handle attribute updates
    const attributesJson = formData.get('attributes')
    if (attributesJson && typeof attributesJson === 'string') {
      const attributes = JSON.parse(attributesJson)

      // Delete existing attributes
      await prisma.productAttribute.deleteMany({
        where: { productId: id },
      })

      // Create new attributes
      await prisma.productAttribute.createMany({
        data: attributes.map((attr: any) => ({
          productId: id,
          name: attr.name,
          value: attr.value,
          qty: attr.qty,
          price: attr.price,
          priceWholesaler: attr.priceWholesaler,
        })),
      })
    }

    // Fetch the updated product with all related data
    const finalProduct = await prisma.products.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        productImage: true,
        attributes: true,
      },
    })

    return NextResponse.json(finalProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // First, check if the product exists and if it has any related sale details
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        saleDetail: true,
        productImage: true,
        attributes: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // If there are related sale details, we can't delete the product
    if (product.saleDetail.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete product. It is associated with existing sales.',
        },
        { status: 409 }
      )
    }

    // If no related sale details, proceed with deletion
    const deletedProduct = await prisma.products.delete({
      where: { id },
    })

    return NextResponse.json(deletedProduct)
  } catch (error) {
    console.error('Error deleting product:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error:
              'Cannot delete product due to existing references in other tables.',
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
