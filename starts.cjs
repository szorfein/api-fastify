// Declaration Orders:
// 1. Plugin installed from npm
// 2. Our plugins
// 3. Decorator
// 4. Hook
// 5. Services, routes and so on...

// Use CommonJS
const fastify = require("fastify")({ logger: true });
const usersRouter = require("./users-router.cjs");

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

// chaining with after()
fastify
    .register(async function myPlugin(_plugin, opts) {
        fastify.log.info(`Registered first plugin - ${opts.myPlugin.first}`);
    }, opts)
    .register(usersRouter, { prefix: "v1" })
    .register(
        async function usersRouterV2(plugin, _options) {
            plugin.register(usersRouter);
            plugin.delete("/users/:name", (req, res) => {
                const userIndex = plugin.users.findIndex(
                    (user) => user.name === req.params.name,
                );
                plugin.users.splice(userIndex, 1);
                res.send();
            });
        },
        { prefix: "v2" },
    )
    .after((err) => {
        if (err) {
            console.error(`There was an error loading '${err.message}`);
        }
    });

fastify.ready().then(() => {
    fastify.log.info("All plugins are now registered");
    console.log(fastify.printRoutes());
});

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
        age: 17,
    },
]); // [1]

//
// Fastify hooks - add them before listen and route
//

fastify.addHook("onRoute", function inspector(routeOptions) {
    console.log(routeOptions);
});

// Trigger when a new plugin is registered - before called
fastify.addHook("onRegister", function inspector(_plugin, _pluginOptions) {
    console.log("Chapter 2 - plugin and boot process");
});

fastify.addHook("onReady", function preLoading(done) {
    console.log("onReady");
    done();
});

fastify.addHook("onClose", function manageClose(_instance, done) {
    console.log("onClose");
    done();
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
// Fastify routes
//

fastify.route({
    url: "/",
    method: "GET",
    handler: function myHandler(_req, res) {
        res.send({ hello: "world" });
    },
});

//
// Fastify Start
//

fastify.listen({ port: 8080, host: "127.0.0.1" }, function(err, addr) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`listen on ${addr}`);
});
