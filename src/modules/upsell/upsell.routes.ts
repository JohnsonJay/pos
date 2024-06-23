import { FastifyInstance } from 'fastify'
import { addProductUpsell, deleteProductUpsell, getProductUpsells } from './upsell.controller'

export const upsellRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // @ts-ignore - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
  fastify.post('/', { preHandler: [fastify.authenticate] }, addProductUpsell)
  // @ts-ignore - TODO FIX ME
  fastify.get('/:productId', { preHandler: [fastify.authenticate] } , getProductUpsells)
  // @ts-ignore - TODO FIX ME
  fastify.delete('/:productId', { preHandler: [fastify.authenticate] }, deleteProductUpsell)
}
