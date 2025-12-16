"use strict";

const { Sequelize, db } = require("../db/config.js");

// In Sequelize, db.define() create table
// Model name is singular, Sequelize use plurial wh. create table
const User = db.define(
  "User",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {},
);

// This creates the table if it doesn't exist (and does nothing if it already exists)
User.sync();

// the defined model is the class itself
console.log(User === db.models.User); // true

module.exports = User;
