// Use CommonJS
const fastify = require("fastify")({ logger: true });
const usersRouter = require("./users-router.cjs");

//
// Fastify decorator - (The decorators API customizes core Fastify objects)
// Decorator are like global variable?

fastify.decorate("mySpecialProp", "root prop"); // [1]
fastify.decorate("users", [
  {
    name: "Sam",
    age: 23,
  },
  {
    name: "Alice",
    name: 17,
  },
]); // [1]

//
// Fastify plugins
//

function opts(parent) {
  return {
    prefix: "v1",
    myPlugin: {
      first: parent.mySpecialProp, // decorator
    },
  };
}

fastify.register(async function myPlugin(plugin, opts) {
  fastify.log.info(`Registered first plugin - ${opts.myPlugin.first}`);
}, opts);

fastify.register(usersRouter, { prefix: "v1" });
fastify.register(
  async function usersRouterV2(plugin, options) {
    plugin.register(usersRouter);
    plugin.delete("/users/:name", (req, res) => {
      fastify.log.info(`get param ${req.params.name}`);
      const userIndex = plugin.users.findIndex(
        (user) => user.name === req.params.name,
      );
      plugin.users.splice(userIndex, 1);
      res.send();
    });
  },
  { prefix: "v2" },
);

fastify.ready().then(() => {
  fastify.log.info("All plugins are now registered");
  console.log(fastify.printRoutes());
});

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

//
// Fastify Start
//

fastify.listen({ port: 8080, host: "127.0.0.1" }, function (err, addr) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`listen on ${addr}`);
});
