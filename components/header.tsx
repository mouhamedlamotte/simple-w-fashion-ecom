"use client"

import Link from "next/link"
import { useAuthStore, useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut } from "lucide-react"

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartItems = useCartStore((state) => state.items)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          FASHION
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Produits
          </Link>
           {user?.role === "USER" && (
            <Link href="/orders" className="text-sm font-medium hover:text-primary">
              Mes commandes
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary">
              Admin
            </Link>
          )}

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
