import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Inscription</h1>
          <p className="mt-2 text-sm text-muted-foreground">Créez votre compte pour commencer</p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
