import { z } from 'zod'
import { buildJsonSchemas } from "fastify-zod";

export const userRegistrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 8 characters long')
});

export const userLoginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
    password: z.string().min(6, 'Password must be at least 8 characters long')
});

export const userRegistrationResponseSchema = z.object({
    id: z.number().int(),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
});

export const userLoginResponseSchema = z.object({
    token: z.string(),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type UserRegistrationResponse = z.infer<typeof userRegistrationResponseSchema>
export type UserLoginResponse = z.infer<typeof userLoginResponseSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    userRegistrationSchema,
    userLoginSchema,
    userRegistrationResponseSchema,
    userLoginResponseSchema
})
