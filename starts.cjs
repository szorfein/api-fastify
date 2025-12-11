// Use CommonJS
const fastify = require("fastify")({ logger: true });

fastify.get("/", function (req, res) {
  res.send({ hello: "world" });
});

fastify.listen({ port: 8080, host: "127.0.0.1" }, function (err, addr) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`listen on ${addr}`);
});
