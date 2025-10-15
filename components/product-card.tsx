"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string
  slug: string
  onAddToCart?: () => void
}

export function ProductCard({ id, name, price, image, slug, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      <Link href={`/products/${slug}`}>
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg?height=400&width=300"}
            alt={name}
            width={300}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-balance hover:text-primary">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold">{price?.toFixed(2)} €</p>
          <Button size="icon" variant="ghost" onClick={onAddToCart}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
