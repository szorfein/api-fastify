'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async function schemaLoaderUserPlugin(fastify, _opts) {
    fastify.addSchema(require('./user.json'));
    fastify.addSchema(require('./list-user.json'));
    fastify.addSchema(require('./list-user-response.json'));
    fastify.addSchema(require('./read-user.json'));
    fastify.addSchema(require('./read-user-response.json'));
    fastify.addSchema(require('./edit-user-body.json'));
});
