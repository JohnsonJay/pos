import fastify, { FastifyRequest } from "fastify";
import sequelize from "../config/mysql.adapter";
import { userRoutes } from "../modules/user/user.routes";
import { HttpResponseCodes } from "../utils/httpResponseCodes";
import User from "../modules/user/user.model";
import { authenticateUser } from "../utils/authUtils";
import cookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";

const app = fastify();

beforeAll(async () => {
    await sequelize.authenticate();
    await User.sync({ force: true });

    app.register(fjwt, { secret: process.env.JWT_SECRET! })
    app.decorate( 'authenticate', authenticateUser);
    app.register(cookie, { secret: process.env.JWT_SECRET!, hook: 'preHandler' })
    app.addHook('preHandler', (request: FastifyRequest, _, next) => {
        request.jwt = app.jwt;
        return next();
    });
    app.register(userRoutes);
    await app.ready();
});

afterAll(async () => {
    await sequelize.close();
    await app.close();
});

describe('User Routes', () => {
    const user = {
        email: 'test@example.com',
        password: 'password123',
    };

    it('should register a new user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/register',
            payload: user,
        });

        expect(response.statusCode).toBe(HttpResponseCodes.CREATED);
        expect(response.json()).toHaveProperty('email', user.email);
    });

    it('should not register an existing user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/register',
            payload: user,
        });

        expect(response.statusCode).toBe(HttpResponseCodes.CONFLICT);
        expect(response.body).toBe('User already exists.');
    });

    it('should login an existing user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: user,
        });

        // expect(response.statusCode).toBe(HttpResponseCodes.OK);
        expect(response.json()).toHaveProperty('token');
        expect(response.cookies).toContainEqual(
            expect.objectContaining({
                name: 'access_token',
            })
        );
    });

    it('should not login a user with invalid password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: { ...user, password: 'wrongpassword' },
        });

        expect(response.statusCode).toBe(HttpResponseCodes.CONFLICT);
        expect(response.json()).toHaveProperty('error', 'Invalid email or password');
    });

    it('should logout a user', async () => {
        // Simulate a logged-in user
        const loginResponse = await app.inject({
            method: 'POST',
            url: '/login',
            payload: user,
        });

        const cookies = loginResponse.cookies;

        // @ts-ignore
        const response = await app.inject( {
            method: "DELETE",
            url: "/logout",
            cookies: {
                // @ts-ignore
                access_token: cookies.find( cookie => cookie.name === "access_token" )?.value,
            },
        } );

        // @ts-ignore
        expect(response.statusCode).toBe(HttpResponseCodes.OK);
        expect(response.body).toBe('User has been logged out.');
    });
});
