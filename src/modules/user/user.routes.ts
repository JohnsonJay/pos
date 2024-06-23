import { loginUser, createUser, logoutUser } from "./user.controller";
import { FastifyInstance } from 'fastify'
import { $ref, userSchemas } from "./user.schema";

export const userRoutes = async (fastify: FastifyInstance): Promise<void> => {
    // add schemas
    for (let schema of [...userSchemas]) {
        fastify.addSchema(schema)
    }

    fastify.post('/register', {
            schema: {
                body: $ref('userRegistrationSchema'),
                response: {
                    201: $ref('userRegistrationResponseSchema'),
                }
            }
        }, createUser);

    fastify.post('/login', {
        schema: {
            body: $ref('userLoginSchema'),
            response: {
                201: $ref('userLoginResponseSchema'),
            }
        }
    } ,loginUser);
    // @ts-ignore - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
    fastify.delete('/logout',  { preHandler: [fastify.authenticate] }, logoutUser);

    fastify.log.info('User routes registered');
}
