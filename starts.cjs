// Use CommonJS
const fastify = require("fastify")({ logger: true });

//
// Fastify process.once
//

// C^C gracefully
process.once("SIGINT", async function closeApp() {
  const tenSeconds = 6000;
  const timeout = setTimeout(function forceClose() {
    fastify.log.error("force closing server");
    process.exit(1);
  }, tenSeconds);
  timeout.unref();

  try {
    await fastify.close();
    fastify.log.info("bye");
  } catch (err) {
    fastify.log.error(err, "error turning off");
  }
});

// End process.once

//
// Fastify hooks - add them before listen and route
//

fastify.addHook("onRoute", function inspector(routeOptions) {
  console.log(routeOptions);
});

// Trigger when a new plugin is registered - before called
fastify.addHook("onRegister", function inspector(plugin, pluginOptions) {
  console.log("Chapter 2 - plugin and boot process");
});

fastify.addHook("onReady", function preLoading(done) {
  console.log("onReady");
  done();
});

fastify.addHook("onClose", function manageClose(instance, done) {
  console.log("onClose");
  done();
});

// End Hooks

//
// Fastify routes
//

fastify.route({
  url: "/",
  method: "GET",
  handler: function myHandler(req, res) {
    res.send({ hello: "world" });
  },
});

// End Routes

fastify.listen({ port: 8080, host: "127.0.0.1" }, function (err, addr) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`listen on ${addr}`);
});
