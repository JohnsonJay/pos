import { z } from 'zod'

// Schema for adding product upsell
export const addProductUpsellSchema = z.object({
  productId: z.number().int().positive(),
  relatedProductIds: z.array(z.number().int().positive()).nonempty()
})

// Schema for getting product upsells
export const getProductUpsellsSchema = z.object({
  productId: z.number().int().positive()
})

// Schema for deleting product upsell
export const deleteProductUpsellSchema = z.object({
  productId: z.number().int().positive(),
  relatedProductId: z.number().int().positive()
})

// Response schemas
export const productUpsellResponseSchema = z.object({
  productId: z.number().int().positive(),
  upsellProductId: z.number().int().positive()
})

export const productWithUpsellsResponseSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  upsell: z.array(productUpsellResponseSchema).optional()
})

// Export types
export type AddProductUpsellInput = z.infer<typeof addProductUpsellSchema>
export type GetProductUpsellsInput = z.infer<typeof getProductUpsellsSchema>
export type DeleteProductUpsellInput = z.infer<typeof deleteProductUpsellSchema>
export type ProductUpsellResponse = z.infer<typeof productUpsellResponseSchema>
export type ProductWithUpsellsResponse = z.infer<typeof productWithUpsellsResponseSchema>
