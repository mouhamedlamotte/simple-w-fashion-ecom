"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductInput } from "@/lib/validations"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/store"

interface ProductFormProps {
  onSuccess?: () => void
}

interface Category {
  id: string
  name: string
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const user = useAuthStore((state) => state.user)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Fetch categories error:", error)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: ProductInput) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role || "",
        },
        body: JSON.stringify({
          ...data,
          images: imageUrl ? [imageUrl] : [],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue")
        return
      }

      reset()
      setImageUrl("")
      onSuccess?.()
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" placeholder="Robe élégante" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="robe-elegante" {...register("slug")} />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Description du produit" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="99.99"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" placeholder="10" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Catégorie</Label>
        <Select onValueChange={(value) => setValue("categoryId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de l'image</Label>
        <Input
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Création..." : "Créer le produit"}
      </Button>
    </form>
  )
}
