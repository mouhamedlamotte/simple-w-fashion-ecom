import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations"
import { getUserByEmail, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const user = await getUserByEmail(validatedData.email)

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Connexion réussie",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 })
  }
}
