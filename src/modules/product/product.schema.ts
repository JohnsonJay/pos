import { z } from 'zod'
import { buildJsonSchemas } from "fastify-zod";

export const addProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // This doesn't validate that the input is a decimal
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const addProductResponseSchema = z.object({
  productId: z.number().int(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export const productSchema = z.object({
  productId: z.number().int().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const createProductSchema = productSchema.omit({
  productId: true,
  createdAt: true,
  updatedAt: true
});

export const createProductResponseSchema = productSchema.omit({
  productId: true,
  createdAt: true,
  updatedAt: true
})

export const updateProductSchema = productSchema.partial()

export const productResponseSchema = productSchema
export const productsArrayResponseSchema = z.array(productResponseSchema)

export type AddProductInput = z.infer<typeof addProductSchema>
export type AddProductResponse = z.infer<typeof addProductResponseSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductsArrayResponse = z.infer<typeof productsArrayResponseSchema>

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  addProductSchema,
  addProductResponseSchema
})


