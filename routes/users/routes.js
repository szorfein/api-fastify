'use strict';

const User = require('../../models/user.js');

module.exports = async function (fastify, _opts) {
    // GET /users, params are get on req.query
    // On Atac, send Params
    // skip, 12
    // limit, 0
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            querystring: fastify.getSchema('schema:user:list'),
            response: {
                // The ajv schema automatically remove password and salt from the reply
                200: fastify.getSchema('schema:user:list:response'),
            },
        },
        handler: async function userList(req, res) {
            const { skip, limit } = req.query;
            console.log(`skip: ${skip}, limit: ${limit}`);
            try {
                // doc on limit: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#limits-and-pagination
                const users = await User.findAll({
                    limit: limit || 10,
                    offset: skip || 0,
                });

                const totalCount = await User.count();

                res.code(200);
                return { data: users, totalCount };
            } catch (e) {
                console.error('Error occurred: ', e.message);
                res.send(e);
            }
        },
    });

    // GET /users/:id - e.g: /users/43dda942-ec6b-442e-9f3e-a8c8ad545f14
    // On Atac, just query the full url
    fastify.route({
        method: 'GET',
        url: '/:id',
        schema: {
            params: fastify.getSchema('schema:user:read'),
            response: {
                200: fastify.getSchema('schema:user:read:response'),
            },
        },
        handler: async function readUser(req, res) {
            const id = req.params.id;
            console.log(`requested user id: ${id}`);
            // The findByPk method obtains only a single entry from the table, using the provided primary key.
            const user = await User.findByPk(id);
            if (user === null) {
                res.code(404);
                return { data: 'Not found' };
            } else {
                res.code(200);
                return { data: user };
            }
        },
    });

    // PUT /users/:id - e.g: /users/43dda942-ec6b-442e-9f3e-a8c8ad545f14
    // On Atac, send a Body (JSON)
    // { "email": "newbob@revolt.org" }
    fastify.route({
        method: 'PUT',
        url: '/:id',
        schema: {
            // same params from user:read
            params: fastify.getSchema('schema:user:read'),
            // but different body
            body: fastify.getSchema('schema:user:edit:body'),
            response: {
                // just return an id like create:response
                200: fastify.getSchema('schema:auth:credential:response'),
            },
        },
        handler: async function editUser(req, res) {
            const id = req.params.id;
            const email = req.body.email;
            console.log(`requested user id: ${id}, email: ${email}`);
            try {
                // updatedAt is automatically updated
                await User.update(
                    { email: email },
                    {
                        where: {
                            id: id,
                        },
                    }
                );
                res.code(200); // success code
                return { id: id };
            } catch (err) {
                res.code(404);
                console.log(`error: ${err}`);
                return { data: `Unable to edit user ${id}` };
            }
        },
    });

    // DELETE /users/:id - e.g: /users/43dda942-ec6b-442e-9f3e-a8c8ad545f14
    // On Atac, just query the full url
    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: {
            // same params from user:read
            params: fastify.getSchema('schema:user:read'),
        },
        handler: async function deleteUser(req, res) {
            const id = req.params.id;

            try {
                await User.destroy({
                    where: {
                        id: id,
                    },
                });
                res.code(204); // no content response
            } catch (err) {
                console.log(`error on DELETE user ${id}`);
                res.code(404);
                return { error: `user id ${id} not found` };
            }
        },
    });
};
