const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Provinsi = require("./ref_geo_provinsi");


const { DataTypes } = Sequelize;

const Kabko = db.define(
  "refGeoKabko",
  {
    kode_provinsi: {
        type: DataTypes.CHAR(8),
        allowNull: true,
        primaryKey: true,
      },
      kode_kabko: {
        type: DataTypes.CHAR(11),
        allowNull: true,
        primaryKey: true,
      },
    nama_kabko: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    pusat_kabko: {
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
    tableName: "ref_geo_kabko",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

Kabko.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi", as:"provinsi"})
module.exports = Kabko;
