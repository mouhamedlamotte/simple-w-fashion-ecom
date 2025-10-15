import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get("x-user-role")

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.category.create({
      data: validatedData,
    })

    return NextResponse.json({ category, message: "Catégorie créée avec succès" })
  } catch (error) {
    console.error("Create category error:", error)
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

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Catégorie supprimée avec succès" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 })
  }
}
