import { JWT } from '@fastify/jwt'
import { UserRegistrationResponse } from '../modules/user/user.schema'

// adding jwt property to req
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authentication: any
  }
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: RegisterUserResponse
  }
}
