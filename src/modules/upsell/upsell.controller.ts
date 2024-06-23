import { FastifyReply, FastifyRequest } from 'fastify'
import Product from '../product/product.model'
import { getProduct } from '../product/product.controller'
import {
  addProductUpsellSchema,
  deleteProductUpsellSchema
} from './upsell.schema'
import { HttpResponseCodes } from '../../utils/httpResponseCodes'

export const addProductUpsell = async (request: FastifyRequest, reply: FastifyReply) => {
  const validation = addProductUpsellSchema.safeParse(request.body)
  if (!validation.success) {
    return await reply.status(HttpResponseCodes.BAD_REQUEST).send(validation.error)
  }

  const { productId, relatedProductIds } = validation.data

  try {
    const product = await getProduct(productId)

    if (product == null) {
      return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Product not found' })
    }

    await product.addUpsell(relatedProductIds)
    reply.status(HttpResponseCodes.CREATED).send(product)
  } catch (error) {
    console.error(error)
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Could not add product upsell' })
  }
}

export const getProductUpsell = async (request: FastifyRequest, reply: FastifyReply) => {
  // TODO commenting out validation until I think of a plan to parse the data first

  // TODO Add Validation

  const { productId } = request.params as { productId: number }

  try {
    const productUpsells = await Product.findByPk(productId, {
      include: [{ model: Product, as: 'upsell' }]
    })

    if (productUpsells == null) {
      return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Product not found' })
    }

    // TODO Add Validation

    reply.status(HttpResponseCodes.OK).send(productUpsells)
  } catch (error) {
    console.error(error)
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Could not retrieve product upsells' })
  }
}

export const deleteProductUpsell = async (request: FastifyRequest, reply: FastifyReply) => {
  const validation = deleteProductUpsellSchema.safeParse(request.body)
  if (!validation.success) {
    return await reply.status(HttpResponseCodes.BAD_REQUEST).send(validation.error)
  }

  const { productId, relatedProductId } = validation.data

  try {
    const product = await Product.findByPk(productId)

    if (product == null) {
      return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Product upsell not found' })
    }

    await product.removeUpsell(relatedProductId)
    reply.status(HttpResponseCodes.OK).send(`Product ${relatedProductId} has been removed from upsell`)
  } catch (error) {
    console.error(error)
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Could not delete product upsell' })
  }
}
