'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async function schemaLoaderAuthPlugin(fastify, _opts) {
    fastify.addSchema(require('./credential.json'));
    fastify.addSchema(require('./credential-response.json'));
    fastify.addSchema(require('./token-header.json'));
    fastify.addSchema(require('./token-response.json'));
});
