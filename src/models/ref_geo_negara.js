const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const Negara = db.define(
  "refGeoNegara",
  {
    kode_negara: {
      type: DataTypes.CHAR(5),
      allowNull: true,
      primaryKey: true,
    },
    nama_negara: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ibukota_negara: {
    type: DataTypes.STRING(100),
    allowNull: true,
    },
    ucr: {
    type: DataTypes.TEXT,
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
    tableName: "ref_geo_negara",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = Negara;
