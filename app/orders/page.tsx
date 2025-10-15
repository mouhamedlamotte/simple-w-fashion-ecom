"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: {
    quantity: number
    product: {
      name: string
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders", {
          headers: {
            "x-user-id": user.id,
          },
        })
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Fetch orders error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Mes Commandes</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">Vous n'avez pas encore de commandes</p>
            <Link href="/products">
              <Button className="mt-4">Découvrir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Commande #{order.id}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="mt-2 text-sm">
                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total?.toFixed(2)} €</p>
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
