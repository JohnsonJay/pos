import { FastifyInstance } from 'fastify'
import { createTransaction, getTransaction } from './transaction.controller'

export const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // @ts-expect-error - TODO FIX ME - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
  fastify.post('/', { preHandler: [fastify.authenticate] }, createTransaction)
  // @ts-expect-error - TODO FIX ME
  fastify.get('/:transactionId', { preHandler: [fastify.authenticate] }, getTransaction)
  fastify.log.info('Transaction routes registered')
}
