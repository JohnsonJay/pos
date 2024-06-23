import { FastifyInstance } from 'fastify'
import { addProductUpsell, deleteProductUpsell, getProductUpsell } from './upsell.controller'

export const upsellRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // @ts-expect-error - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
  fastify.post('/', { preHandler: [fastify.authenticate] }, addProductUpsell)
  // @ts-expect-error - TODO FIX ME
  fastify.get('/:productId', { preHandler: [fastify.authenticate] }, getProductUpsell)
  // @ts-expect-error - TODO FIX ME
  fastify.delete('/:productId', { preHandler: [fastify.authenticate] }, deleteProductUpsell)

  fastify.log.info('Upsell routes registered')
}
