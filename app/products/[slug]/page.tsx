"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: { url: string }[]
  category: { name: string }
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        const data = await response.json()
        setProduct(data.product)
      } catch (error) {
        console.error("Fetch product error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        stock: product.stock,
      })
    }
  }

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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Produit non trouvé</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted p-10 max-h-[600px]">
            <Image
              src={product.images[0]?.url || "/placeholder.svg?height=600&width=450"}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.category.name}</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance">{product.name}</h1>
            </div>

            <p className="text-3xl font-bold">{formatCurrency(product.price)}</p>

            {product.description && <p className="text-muted-foreground text-pretty">{product.description}</p>}

            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Stock:</span>{" "}
                {product.stock > 0 ? `${product.stock} disponible(s)` : "Rupture de stock"}
              </p>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
