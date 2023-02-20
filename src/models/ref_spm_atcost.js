const { Sequelize } = require("sequelize");
const db = require("../config/database");
const spjPerorang = require("./trx_spj_perorang_perjadin")

const { DataTypes } = Sequelize;

const refSpmatCost = db.define(
  "refspmatcost",
  {
    nomor_surat_spm: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      
    },
    kode_nomor_spm: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      primaryKey: true,
    },
    nominal: {
        type: DataTypes.BIGINT(25),
        allowNull: true,
      },
    status: {
        type: DataTypes.CHAR(5),
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
    tableName: "ref_spm_atcost",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refSpmatCost.hasMany(spjPerorang,{foreignKey:"kode_nomor_spm"})

module.exports = refSpmatCost;
