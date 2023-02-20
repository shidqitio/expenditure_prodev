const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const refPerjalanan = db.define(
  "refPerjalanan",
  {
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_katagori: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_tempat_asal: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    asal: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_tempat_tujuan: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    tujuan: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    transpor: {
      type: DataTypes.ENUM("UDARA", "DARAT", "LAUT"),
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
    tableName: "ref_perjalanan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


module.exports = refPerjalanan;
