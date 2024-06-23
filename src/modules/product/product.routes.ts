import { FastifyInstance } from 'fastify'
import { addProduct, getAllProducts, getProductById, updateProduct } from './product.controller'
import { $ref, addProductResponseSchema, addProductSchema, productSchema, productSchemas } from './product.schema'

export const productRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // add schemas
  for (const schema of [...productSchemas]) {
    fastify.addSchema(schema)
  }

  fastify.post('/', {
    // @ts-expect-error - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
    preHandler: [fastify.authenticate]
  }, addProduct)
  // @ts-expect-error - TODO FIX ME
  fastify.get('/', { preHandler: [fastify.authenticate] }, getAllProducts)
  // @ts-expect-error - TODO FIX ME
  fastify.get('/:productId', { preHandler: [fastify.authenticate] }, getProductById)
  // @ts-expect-error - TODO FIX ME
  fastify.put('/:productId', { preHandler: [fastify.authenticate] }, updateProduct)

  fastify.log.info('Product routes registered')
}
