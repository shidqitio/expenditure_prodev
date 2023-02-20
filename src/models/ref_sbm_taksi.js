const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Provinsi = require("./ref_geo_provinsi");

const { DataTypes } = Sequelize;

const refSBMTaksi = db.define(
  "refSBMTaksi",
  {
    nomor_sk_sbm: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
    kode_provinsi: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        primaryKey: true,
      },
    kode_katagori_sbm: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        primaryKey: true,
    },
    satuan: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
    biaya: {
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
    tableName: "ref_sbm_taksi_dalam_negeri",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refSBMTaksi.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi", as:"provinsi"})

module.exports = refSBMTaksi;
