"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Fetch order error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Commande non trouvée</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Commande confirmée !</h1>
            <p className="mt-2 text-muted-foreground">Merci pour votre achat</p>
          </div>

          <div className="mt-8 rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Détails de la commande</h2>
            <p className="mt-2 text-sm text-muted-foreground">Commande #{order.id}</p>

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}

              <div className="flex justify-between pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Continuer vos achats
              </Button>
            </Link>
            <Link href="/orders" className="flex-1">
              <Button className="w-full">Voir mes commandes</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
