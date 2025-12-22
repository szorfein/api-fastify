# 🚀 api-fastify

🎯TODO list 🎯:

- API Keys, config header 'Authorization: Bearer <Token>', bcryptjs
- RBAC
- Filter with Joi? or Zod?
- JWT Auth, OAuth providers, (T)OTP?, Keycloak?
- Helmet
- [QS](https://github.com/VanoDevium/fastify-qs) library?
- Send Email on Fastify Hook afterCreate?
- Swagger?
- Container with Docker

Done:

- ✓ Restful API (no plan to add Graphql)
- ✓ Add Postgres with [Sequelize](https://sequelize.org)
- ✓ Pagination, skip, limit
- ✓ Control I/O with schema using [ajv](https://ajv.js.org), [ajv-format](https://github.com/ajv-validator/ajv-formats) include in Fastify

## Install

    npm ci

## Start

```bash
npm start
```

## App

Go to http://localhost:3000

## Refs

- https://fastify.dev/docs/latest/
- https://github.com/PacktPublishing/Accelerating-Server-Side-Development-with-Fastify/tree/main
- https://github.com/JonathanWexler/oreilly-node-projects-code

About simple pg

- https://wanjohi.vercel.app/2021/04/20/Fastify-and-PostgreSQL-REST-API/

About knex

- https://github.com/avanelli/fastify-realworld-example-app/blob/main/lib/plugins/knex/index.js
- https://medium.com/codingmountain-blog/backend-with-fastify-part-3-setting-up-a-postgresql-database-with-knex-009d238a048a
