"use client"

import { Header } from "@/components/header"
import { useCartStore, useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const total = useCartStore((state) => state.total)
  const clearCart = useCartStore((state) => state.clearCart)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          userId: user.id,
          items,
          total: total(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Une erreur est survenue")
        return
      }

      clearCart()
      router.push(`/orders/${data.order.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Panier</h1>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">Votre panier est vide</p>
            <Link href="/products">
              <Button className="mt-4">Continuer vos achats</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border bg-card p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg?height=96&width=96"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.price?.toFixed(2)} €</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        disabled={item.quantity === 1}
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.stock)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        disabled={item.quantity >= item.stock}
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <p className="font-semibold">{(item.price * item.quantity)?.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold">Résumé</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{total()?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{total()?.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                  {loading ? "Traitement..." : "Passer la commande"}
                </Button>

                <Link href="/products">
                  <Button variant="outline" className="mt-2 w-full bg-transparent">
                    Continuer vos achats
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
