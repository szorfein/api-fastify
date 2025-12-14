const fp = require("fastify-plugin");

// plugins are just async function
async function usersRouter(fastify, _) {
    fastify.register(
        async function routes(child, _opts) {
            child.get("/", async (_req, res) => {
                res.send(child.users);
            });
            child.post("/", async (req, res) => {
                const newUser = req.body;
                child.users.push(newUser);
                res.send(newUser);
            });
        },
        { prefix: "users" },
    );
}

module.exports = fp(usersRouter, {
    name: "usersRouter",
    fastify: "5.x",
    decorators: { fastify: ["users"] },
});
