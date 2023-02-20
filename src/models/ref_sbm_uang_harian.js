const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Provinsi = require("./ref_geo_provinsi");

const { DataTypes } = Sequelize;

const SbmUangHarian = db.define(
  "refSbmUangHarian",
  {
    kode_provinsi: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        primaryKey: true,
      },
    satuan: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
    luarkota: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
     dalamkota: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      diklat: {
        type: DataTypes.DECIMAL(10,2),
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
    tableName: "ref_sbm_uang_harian",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SbmUangHarian.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi", as:"provinsi"})

module.exports = SbmUangHarian;
