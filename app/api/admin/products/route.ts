import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { productSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const { images, ...productData } = body
    const validatedData = productSchema.parse(productData)

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: images
          ? {
              create: images.map((url: string) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json({ product, message: "Produit créé avec succès" })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 })
  }
}
