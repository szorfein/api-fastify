"use strict"

// isolate from plugins dir

const fp = require('fastify-plugin')

module.exports = fp(function schemasLoader(fastify, opts, next) {
    //fastify.addScheme(require('./a-schema.json'))
    next()
})
