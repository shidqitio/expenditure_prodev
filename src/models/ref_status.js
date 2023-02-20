const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const Status = db.define(
  "ref_status",
  {
    kode_status: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      primaryKey: true,
    },
    keterangan_status: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },

  },
  {
    tableName: "ref_status",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Status;
