const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Negara = require("./ref_geo_negara");

const { DataTypes } = Sequelize;

const Provinsi = db.define(
  "refGeoProvinsi",
  {
    kode_negara: {
      type: DataTypes.CHAR(5),
      allowNull: true,
      primaryKey: true,
    },
    kode_provinsi: {
        type: DataTypes.CHAR(8),
        allowNull: true,
        primaryKey: true,
      },
    nama_provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ibukota_provinsi: {
    type: DataTypes.STRING(100),
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
    tableName: "ref_geo_provinsi",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

Provinsi.belongsTo(Negara,{foreignKey:"kode_negara", as:"negara"});

module.exports = Provinsi;
