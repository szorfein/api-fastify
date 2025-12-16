"use strict";

const User = require("../../models/user.js");

module.exports = async function (fastify, _opts) {
  fastify.get("/", async function (_request, reply) {
    try {
      const users = await User.findAll();
      reply.send(users);
    } catch (e) {
      console.error("Error occurred: ", e.message);
      reply.send(e);
    }
  });
};
