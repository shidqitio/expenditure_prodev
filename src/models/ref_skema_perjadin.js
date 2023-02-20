const { Sequelize } = require("sequelize");
const db = require("../config/database");
const komponen = require("./trx_komponen_perjadin_1");

const { DataTypes } = Sequelize;

const SkemaPerjadin = db.define(
  "SkemaPerjadin",
  {
    kode_skema_perjadin: {
      type: DataTypes.STRING(1),
      allowNull: true,
      primaryKey: true,
    },
    nama_skema_perjadin: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    ucr: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    udcr: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    udch: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_skema_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = SkemaPerjadin;
