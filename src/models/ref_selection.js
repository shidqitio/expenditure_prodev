const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const refSelection = db.define(
  "refSelection",
  {
    kode_selection: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nilai1: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nilai2: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nilai3: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nilai4: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
  },
  {
    tableName: "ref_selection",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = refSelection;
