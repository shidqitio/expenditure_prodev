const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Provinsi = require("./ref_geo_provinsi");
const Pokjar = require("./ref_geo_pokjar");

const { DataTypes } = Sequelize;

const SbmTransport = db.define(
  "refSbmTransport",
  {
    kode_unit: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        primaryKey: true,
      },
    kode_provinsi_asal: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
    asal: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      primaryKey: true,
    },
    tujuan: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        primaryKey: true,
      },
      kode_provinsi_tujuan: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
    udara: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
     darat: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      laut: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      keterangan: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
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
    tableName: "ref_sbm_transport",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

Provinsi.hasMany(SbmTransport, {foreignKey: "kode_provinsi_asal", as: "ProvinsiAsal" })
Provinsi.hasMany(SbmTransport, {foreignKey: "kode_provinsi_tujuan", as: "ProvinsiTujuan" })

SbmTransport.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi_asal", as:"provinsi_asal"})

SbmTransport.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi_tujuan", as:"provinsi_tujuan"})

Pokjar.hasMany(SbmTransport,{foreignKey:"asal", as:"pokjarasal"})
Pokjar.hasMany(SbmTransport,{foreignKey:"tujuan", as:"pokjartujuan"})

SbmTransport.belongsTo(Pokjar, {targetKey: 'kode_pokjar',foreignKey: "asal",as: "pokjar_asal",})

SbmTransport.belongsTo(Pokjar,{targetKey: 'kode_pokjar',foreignKey:"tujuan", as:"pokjar_tujuan"})

module.exports = SbmTransport;
