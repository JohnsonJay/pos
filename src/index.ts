import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { userRoutes } from './modules/user/user.routes'
import fjwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import { authenticateUser } from './utils/authUtils'
import cors from '@fastify/cors'
import { productRoutes } from './modules/product/product.routes'
import { upsellRoutes } from './modules/upsell/upsell.routes'
import { transactionRoutes } from './modules/transaction/transaction.routes'

// this would look nice as a class... but OOP in JS...
export const mainFastify = (options = {}): FastifyInstance => {
  // initialise app
  const app: FastifyInstance = Fastify(options)

  // initialise jwt and auth
  void app.register(fjwt, { secret: process.env.JWT_SECRET || 'jwt_secret' })
  app.addHook('preHandler', (request: FastifyRequest, _, next) => {
    // @ts-expect-error - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
    request.jwt = app.jwt
    return next()
  })
  void app.register(cookie, { secret: process.env.JWT_SECRET!, hook: 'preHandler' })
  void app.decorate('authenticate', authenticateUser)

  void app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })

  // Register routes
  void app.register(userRoutes, { prefix: 'auth' })
  void app.register(productRoutes, { prefix: 'product' })
  void app.register(upsellRoutes, { prefix: 'upsell' })
  void app.register(transactionRoutes, { prefix: 'transaction' })

  return app
}
