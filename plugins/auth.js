'use strict';

const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');

module.exports = fp(
    async function authenticationPlugin(fastify, opts) {
        // Map instance (store a simple key/value pair)
        const revokeTokens = new Map();

        fastify.register(fastifyJwt, {
            secret: process.env['JWT_SECRET'],
            trusted: function isTrusted(req, decodedToken) {
                // jti mean JWT ID
                return !revokeTokens.has(decodedToken.jti);
            },
            //sign: { algorithm: 'ES256' },
        });

        fastify.decorate('authenticate', async function authenticate(req, res) {
            try {
                await req.jwtVerify();
            } catch (err) {
                res.send(err);
            }
        });

        // decorateRequest will add generateToken() in all fastify.request
        // In route, access on request.generateToken()
        fastify.decorateRequest('generateToken', async function () {
            const token = await fastify.jwt.sign(
                // this = request, user is stored in request in routes/auth/login
                {
                    id: String(this.user.id),
                    email: this.user.email,
                },
                {
                    jti: String(Date.now()),
                    expiresIn: process.env['JWT_EXPIRE_IN'],
                }
            );
            return token;
        });

        // revoke token
        fastify.decorateRequest('revokeToken', function () {
            // this = request,
            revokeTokens.set(this.user.jti, true);
        });
    },
    {
        name: 'authentication-plugin',
    }
);
