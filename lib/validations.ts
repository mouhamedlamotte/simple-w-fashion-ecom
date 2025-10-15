import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
})

export const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  description: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  price: z.number().positive("Le prix doit être positif"),
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  categoryId: z.string().min(1, "La catégorie est requise"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
