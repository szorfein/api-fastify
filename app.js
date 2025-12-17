'use strict';

const path = require('node:path');
const AutoLoad = require('@fastify/autoload');

// Pass --options via CLI arguments in command to enable these options.
const options = {};

console.log(process.env['API_CLIENT']);

module.exports = async function (fastify, opts) {
    // Place here your custom code!

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
    });

    // Load schema loader
    // match with
    // schemas/skull/loader.js
    // schemas/cake/loader.js
    // ...
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'schemas'),
        indexPattern: /^loader.js$/i
    })

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts),
    });
};

module.exports.options = {
    ajv: {
        customOptions: {
            // is used to filter out properties from the data that are not defined in the schema
            removeAdditional: 'all',
        },
    },
    options,
};
