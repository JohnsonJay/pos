import { FastifyReply, FastifyRequest } from 'fastify'
import User from './user.model'
import { comparePassword, hashPassword } from "../../utils/authUtils";
import {
    UserLoginInput,
    userLoginSchema,
    UserRegistrationInput,
    userRegistrationSchema
} from "./user.schema";
import { HttpResponseCodes } from "../../utils/httpResponseCodes";

const existingUser = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ where: { email } })
    return !!user;
}

export const createUser = async (
    request: FastifyRequest<{ Body: UserRegistrationInput }>,
    reply: FastifyReply
) => {
    const validation = userRegistrationSchema.safeParse(request.body)
    if (!validation.success) {
        return await reply.status(HttpResponseCodes.BAD_REQUEST).send(validation.error)
    }

    const { email, password } = validation.data

    const userExists = await existingUser(email)
    if (userExists) {
        return await reply.status(HttpResponseCodes.CONFLICT).send('User already exists.')
    }

    const hashedPassword = await hashPassword(password)

    try {
        const newUser = await User.create({ password: hashedPassword, email })
        reply.status(HttpResponseCodes.CREATED).send(newUser)
    } catch (error) {
        reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' })
    }
}

export const loginUser = async (
    request: FastifyRequest<{
        Body: UserLoginInput
    }>,
    reply: FastifyReply
) => {
    const validation = userLoginSchema.safeParse(request.body)
    if (!validation.success) {
        return await reply.status(HttpResponseCodes.BAD_REQUEST).send(validation.error)
    }

    const { email, password } = validation.data;

    try {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'User not found' })
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return await reply.status(HttpResponseCodes.CONFLICT).send({ error: 'Invalid email or password' })
        }

        const payload = {
            id: user.id,
            email: user.email,
        }

        // @ts-ignore - TODO FIX ME // unfortunately typescript keeps complaining about this - definitely something to look in to and fix in the future
        const token = request.jwt.sign(payload)
        
        reply.setCookie('access_token', token, {
                path: '/',
                httpOnly: true,
                secure: true,
            }
        ).status(HttpResponseCodes.OK).send({ token });
    } catch (error) {
        console.error(error)
        return await reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' })
    }
}

export const logoutUser = async (_: FastifyRequest, reply: FastifyReply) => {
    try {
        reply.clearCookie('access_token')
            .status(HttpResponseCodes.OK)
            .send('User has been logged out.')
    } catch (error) {
        console.error(error)
        return await reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' })
    }
}
