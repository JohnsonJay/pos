import * as bcrypt from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FastifyJWT } from '@fastify/jwt'
import { HttpResponseCodes } from './httpResponseCodes'

export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

export const authenticateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.cookies.access_token

  if (!token) {
    return await reply.status(HttpResponseCodes.UNAUTHORIZED).send({ message: 'Authentication required' })
  } else {
    // @ts-expect-error - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
    request.user = request.jwt.verify<FastifyJWT['user']>(token)
  }
}
