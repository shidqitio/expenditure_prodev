const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const refKatagoriPerjadin = db.define(
  "refKatagoriPerjadin",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    katagori_perjadin: {
      type: DataTypes.STRING(225),
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
    tableName: "ref_katagori_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = refKatagoriPerjadin;
