import { z } from 'zod'

// Schema for transaction product input
const transactionProductInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  upsell: z.array(z.number().int().positive()).optional()
})

// Schema for creating a transaction
export const createTransactionSchema = z.object({
  totalPrice: z.number().positive(),
  totalQuantity: z.number().int().positive(),
  products: z.array(transactionProductInputSchema).nonempty()
})

// Schema for getting a transaction
export const getTransactionSchema = z.object({
  transactionId: z.number().int().positive()
})

// Response schemas
const transactionProductResponseSchema = z.object({
  transactionProductId: z.number().int().positive(),
  transactionId: z.number().int().positive(),
  productId: z.number().int().positive(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const transactionResponseSchema = z.object({
  transactionId: z.number().int().positive(),
  totalPrice: z.number().positive(),
  totalQuantity: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  products: z.array(transactionProductResponseSchema).optional()
})

// Export types
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type GetTransactionInput = z.infer<typeof getTransactionSchema>
export type TransactionResponse = z.infer<typeof transactionResponseSchema>
