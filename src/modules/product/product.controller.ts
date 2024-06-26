import { FastifyReply, FastifyRequest } from 'fastify'
import Product from './product.model'
import {
  updateProductSchema,
  UpdateProductInput, addProductSchema, AddProductInput
} from './product.schema'
import { HttpResponseCodes } from '../../utils/httpResponseCodes'

export const getProduct = async (productId: number): Promise<Product | null> => {
  return await Product.findByPk(productId)
}

export const addProduct = async (
  request: FastifyRequest<{ Body: AddProductInput }>, reply: FastifyReply) => {
  const validation = addProductSchema.safeParse(request.body)
  if (!validation.success) {
    return await reply.status(HttpResponseCodes.BAD_REQUEST).send(validation.error)
  }

  const { name, description, price, quantity } = validation.data

  try {
    const newProduct = await Product.create({ name, description, price, quantity })
    reply.status(HttpResponseCodes.OK).send(newProduct)
  } catch (error) {
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unable to create product.' })
  }
}

export const getAllProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const allProducts = await Product.findAll()
    if (!allProducts || allProducts.length < 1) {
      return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'No products were found.' })
    }
    // TODO Add Validation
    reply.status(HttpResponseCodes.OK).send(allProducts)
  } catch (error) {
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unable to get all products.' })
  }
}

export const getProductById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { productId } = request.params as { productId: number }

  try {
    const product = await Product.findByPk(productId)
    if (product != null) {
      // TODO Add Validation
      return await reply.status(HttpResponseCodes.OK).send(product)
    }
    reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Product not found.' })
  } catch (error) {
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unable to get product.' })
  }
}

export const updateProduct = async (request: FastifyRequest, reply: FastifyReply) => {
  const { productId } = request.params as { productId: number }
  const validation = updateProductSchema.safeParse(request.body)
  // TODO Add Validation

  const { name, description, price, quantity } = validation.data as UpdateProductInput

  try {
    const product = await Product.findByPk(productId)
    if (product != null) {
      product.name = name || product.name
      product.description = description || product.description
      product.price = price || product.price
      product.quantity = quantity || product.quantity

      await product.save()
      reply.status(HttpResponseCodes.OK).send(product)
    } else {
      reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Product not found.' })
    }
  } catch (error) {
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unable to update product.' })
  }
}
