import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"
import { createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email)

    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Create new user
    const user = await createUser(validatedData.email, validatedData.password, validatedData.name)

    // Return user without password
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Compte créé avec succès",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 })
  }
}
