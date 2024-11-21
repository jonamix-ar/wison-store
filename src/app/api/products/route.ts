import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'
import slugify from 'slugify'

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        category: true,
        brand: true,
        productImage: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      categoryId: formData.get('categoryId') as string,
      brandId: formData.get('brandId') as string,
      sku: formData.get('sku') as string,
      qty: parseInt(formData.get('qty') as string),
      qtyBellowMin: parseInt(formData.get('qtyBellowMin') as string),
      price: parseFloat(formData.get('price') as string),
      priceWholeSaller: parseFloat(formData.get('priceWholeSaller') as string),
      cost: parseFloat(formData.get('priceWholeSaller') as string),
      promotionalPrice: parseFloat(formData.get('promotionalPrice') as string),
      showPrice: formData.get('showPrice') === 'true',
      showPriceWholeWaller: formData.get('showPriceWholeWaller') === 'true',
      status: formData.get('status') === 'true',
      attributes: JSON.parse(formData.get('attributes') as string),
    }

    const images = formData.getAll('images') as File[]

    const slug = slugify(productData.name, { lower: true, strict: true })

    const newProduct = await prisma.products.create({
      data: {
        name: productData.name,
        slug: slug,
        description: productData.description,
        categoryId: parseInt(productData.categoryId),
        brandId: parseInt(productData.brandId),
        sku: productData.sku,
        qty: productData.qty,
        qtyBellowMin: productData.qtyBellowMin,
        price: productData.price,
        priceWholeSaller: productData.priceWholeSaller,
        cost: productData.cost,
        promotionalPrice: productData.promotionalPrice,
        showPrice: productData.showPrice,
        showPriceWholeWaller: productData.showPriceWholeWaller,
        status: productData.status,
        attributes: {
          create: productData.attributes,
        },
      },
    })

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')

    const imagePromises = images.map(async (image, index) => {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${slug}-${index + 1}${path.extname(
        image.name
      )}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      return prisma.productImage.create({
        data: {
          productId: newProduct.id,
          url: `/uploads/products/${filename}`,
          order: index,
        },
      })
    })

    await Promise.all(imagePromises)

    const createdProduct = await prisma.products.findUnique({
      where: { id: newProduct.id },
      include: {
        category: true,
        brand: true,
        productImage: true,
        attributes: true,
      },
    })

    return NextResponse.json(createdProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
