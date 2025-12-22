'use strict';

const User = require('../../models/user.js');

module.exports = async function (fastify, _opts) {
    // GET /users, params are get on req.query
    // On Atac, send Params
    // skip, 12
    // limit, 0
    // title, bob
    fastify.get('/', async function (req, reply) {
        const { skip, limit, title } = req.query;
        console.log(`skip: ${skip}, limit: ${limit}, title: ${title}`);
        try {
            // doc on limit: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#limits-and-pagination
            const users = await User.findAll({
                limit: limit || 10,
                offset: skip || 0,
            });

            const totalCount = await User.count();

            reply.code(200);

            if (users.length === 0) {
                return { data: 'No user yet' };
            } else {
                return { users, totalCount };
            }
        } catch (e) {
            console.error('Error occurred: ', e.message);
            reply.send(e);
        }
    });

    // POSTS /users, param are get on req.body
    // On Atac, send a Body (JSON)
    // { "email": "bob@revolt.org" }
    fastify.route({
        method: 'POST',
        url: '/',
        handler: async function createUser(req, res) {
            const email = req.body.email;

            console.log(email);

            // start 0, used to create admin or basic user
            console.log(`There are ${await User.count()} users`);

            // Create a new user
            const user = await User.create({ email: email });
            console.log("User's auto-generated ID:", user.id);

            console.log(req.body);

            res.code(201);
            return { id: user.id };
        },
    });

    // GET /users/:id - e.g: /users/43dda942-ec6b-442e-9f3e-a8c8ad545f14
    // On Atac, just query the full url
    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: async function readUser(req, res) {
            const id = req.params.id;
            console.log(`requested user id: ${id}`);
            // The findByPk method obtains only a single entry from the table, using the provided primary key.
            const user = await User.findByPk(id);
            if (user === null) {
                res.code(404);
                return { data: 'Not found' };
            } else {
                res.code(201);
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
                res.code(204);
                return { data: `Successfully updated user id ${id}` };
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
        handler: async function deleteUser(req, res) {
            const id = req.params.id;

            try {
                await User.destroy({
                    where: {
                        id: id,
                    },
                });
                res.code(204); // no content response
                return { success: `user ${id} deleted` };
            } catch (err) {
                console.log(`error on DELETE user ${id}`);
                res.code(404);
                return { error: `user id ${id} not found` };
            }
        },
    });
};
