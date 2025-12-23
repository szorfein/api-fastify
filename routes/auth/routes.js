'use strict';

const User = require('../../models/user.js');
const generateHash = require('./generate-hash.js');

module.exports = async function (fastify, _opts) {
    // POST /auth/register, param are get on req.body
    // On Atac, send a Body (JSON)
    // { "email": "bob@revolt.org", "password": "xxxxxxxx" }
    fastify.route({
        method: 'POST',
        url: '/register',
        schema: {
            body: fastify.getSchema('schema:auth:credential'),
            response: {
                201: fastify.getSchema('schema:auth:credential:response'),
            },
        },
        handler: async function createUser(req, res) {
            const email = req.body.email,
                password = req.body.password;

            console.log(req.body);
            console.log(email);
            console.log(password);

            const { hash, salt } = await generateHash(password);

            console.log(hash);

            // start 0, used to create admin or basic user
            console.log(`There are ${await User.count()} users`);

            try {
                // Create a new user
                const user = await User.create({ email: email, password: hash, salt: salt });
                console.log("User's auto-generated ID:", user.id);

                res.code(201);
                return { id: user.id };
            } catch (err) {
                req.log.error(err, 'Failed to register user');
                res.code(500);
                return { registered: false };
            }
        },
    });

    // POST /auth/login
    // On Atac, send a Body (JSON)
    // { "email": "bob@revolt.org", "password": "xxxxxxxx" }
    fastify.route({
        method: 'POST',
        url: '/login',
        schema: {
            body: fastify.getSchema('schema:auth:credential'),
            response: {
                200: fastify.getSchema('schema:auth:token:response'),
            },
        },
        handler: async function loginUser(req, res) {
            const email = req.body.email,
                password = req.body.password;

            // Next, need to retrieve the user with requested email to compare
            const user = await User.findOne({
                where: {
                    email: email,
                    blocked: false,
                },
            });
            console.log(user);

            if (user === null) {
                // if we return 404, an attacker can use this to find out which users are registered
                const err = new Error('Wrong credentials provided');
                err.statusCode = 401;
                throw err;
            }

            console.log(user.salt);
            console.log(user.dataValues.salt);
            const { hash } = await generateHash(password, user.salt);

            if (hash !== user.password) {
                // if we return 404, an attacker can use this to find out which users are registered
                const err = new Error('Wrong credentials provided');
                err.statusCode = 401;
                throw err;
            }

            // attach user to request, this is used in the decorateRequest function
            // plugins/auth
            req.user = user;
            return refreshHandler(req, res);
        },
    });

    // POST /auth/refresh - need to be authenticate first
    // e.g:
    // /usr/bin/curl http://localhost:3000/auth/login -X POST -H "Content-Type: application/json" -d '{"email": "emily@acrobat.org", "password":"randPass"}'
    // {"token":"eyIgjigBimgmiIekgjimijmIpppPPPP0VCJ9.eyJpZCI6IjU3NzIIGJMIigjgimirmIGIMj04MzE5LWU1ZjgxZGViMGIzYyIsImVtYWlsIjoiZW1pbHlAYWNyb2JhdC5vcmciLCJqdGkiOiIxNzY2NTA3MDM0NTMzIiwiaWF0IjoxNzY2NTA3MDM0LCJleHAiOjE3NjY1OTM0MzR9.Nz479guR2IGJIEMGIhaiahigOOigjig_PUevRP95vtA"}%
    // On Atac, go to Auth (Bearer)
    // add the token
    fastify.route({
        method: 'POST',
        url: '/refresh',
        // decorate function on plugins/auth, don't work without this
        onRequest: fastify.authenticate,
        schema: {
            headers: fastify.getSchema('schema:auth:token:header'),
            response: {
                200: fastify.getSchema('schema:auth:token:response'),
            },
        },
        handler: refreshHandler,
    });

    // generate and return jwt token
    async function refreshHandler(req, res) {
        // decorateRequest function from plugins/auth
        const token = await req.generateToken();
        console.log(`call refreshHandler, token: ${token}`);
        console.log(token.length); // 253
        res.code(200);
        return { token };
    }

    fastify.route({
        method: 'POST',
        url: '/logout',
        onRequest: fastify.authenticate,
        schema: {
            headers: fastify.getSchema('schema:auth:token:header'),
        },
        handler: async function logoutHandler(req, res) {
            // decorateRequest from plugins/auth
            req.revokeToken();
            res.code(204); // success, no object
        },
    });
};
