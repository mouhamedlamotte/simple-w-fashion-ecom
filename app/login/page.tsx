import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
