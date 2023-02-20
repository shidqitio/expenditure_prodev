const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Kabko = require("./ref_geo_kabko");

const { DataTypes } = Sequelize;

const Kecamatan = db.define(
  "refGeoKecamatan",
  {
    kode_kabko: {
        type: DataTypes.STRING(11),
        allowNull: true,
        primaryKey: true,
      },
    kode_kecamatan: {
      type: DataTypes.STRING(14),
      allowNull: true,
      primaryKey: true,
    },
    nama_kecamatan: {
      type: DataTypes.STRING(150),
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
    tableName: "ref_geo_kecamatan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

Kecamatan.belongsTo(Kabko, {foreignKey: "kode_kabko",as: "kabko",});

module.exports = Kecamatan;
