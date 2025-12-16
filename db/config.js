"use strict";

const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
// 1. database, 2. user, 3, password
const db = new Sequelize(
  process.env["PG_DB"],
  process.env["PG_USER"],
  process.env["PG_PASS"],
  {
    host: "localhost",
    dialect: "postgres",
  },
);

async function testdb() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testdb();

module.exports = { Sequelize, db };
