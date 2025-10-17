"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryForm } from "@/components/admin/category-form"
import { ProductForm } from "@/components/admin/product-form"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  category: { name: string }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  user: {
    email: string
    name: string | null
  }
  items: {
    quantity: number
    product: {
      name: string
    }
  }[]
}

const ORDER_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function AdminPage() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes, ordersRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
        fetch("/api/admin/orders", {
          headers: {
            "x-user-role": user?.role || "",
          },
        }),
      ])

      const categoriesData = await categoriesRes.json()
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()

      setCategories(categoriesData.categories || [])
      setProducts(productsData.products || [])
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error("Fetch data error:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-user-role": user?.role || "",
        },
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Delete category error:", error)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-user-role": user?.role || "",
        },
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Delete product error:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role || "",
        },
        body: JSON.stringify({ orderId, status }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Update order status error:", error)
    }
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Administration</h1>

        <Tabs defaultValue="categories" className="space-y-8">
          <TabsList>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Ajouter une catégorie</h2>
                <div className="rounded-lg border bg-card p-6">
                  <CategoryForm onSuccess={fetchData} />
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Catégories existantes</h2>
                {loading ? (
                  <p className="text-muted-foreground">Chargement...</p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-4"
                      >
                        <div>
                          <p className="font-semibold">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.slug}</p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Ajouter un produit</h2>
                <div className="rounded-lg border bg-card p-6">
                  <ProductForm onSuccess={fetchData} />
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Produits existants</h2>
                {loading ? (
                  <p className="text-muted-foreground">Chargement...</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.price)} • Stock: {product.stock} • {product.category.name}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-semibold">Gestion des commandes</h2>
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : orders.length === 0 ? (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg border bg-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div>
                          <p className="font-semibold">Commande #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Client:</span> {order.user.name || order.user.email}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Articles:</span>{" "}
                            {order.items.map((item) => `${item.product.name} (x${item.quantity})`).join(", ")}
                          </p>
                        </div>
                        <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
                      </div>

                      <div className="w-48">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
