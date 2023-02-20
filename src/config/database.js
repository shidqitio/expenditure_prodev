const { Sequelize } = require("sequelize");
require("dotenv").config();
const DATABASE=process.env.DATABASEDB
const USERNAME=process.env.USERNAMEDB
const PASSWORD=process.env.PASSWORDDB
const HOST=process.env.HOSTDB

const db = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
});

module.exports = db;
