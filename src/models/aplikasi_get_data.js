const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const aplikasigetdata = db.define(
  "aplikasigetdata",
  {
    username: {
        type: DataTypes.CHAR(100),
        allowNull: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
  },
  {
    tableName: "aplikasi_get_data",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = aplikasigetdata;
