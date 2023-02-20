const { Sequelize } = require("sequelize");
const db = require("../config/database");
const { DataTypes } = Sequelize;
const perjalanan = require("./ref_perjalanan");
const sbmTranspor =require("./ref_sbm_transpor_perjadin")

const trxPerjalananSbm = db.define(
  "trxPerjalananSbm",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    kode_trx_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_trx_sbm: {
      type: DataTypes.INTEGER(11),
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
    tableName: "trx_perjalanan_sbm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

trxPerjalananSbm.belongsTo(perjalanan,{foreignKey:"kode_trx_perjalanan",targetKey:"kode_trx", as:"bPerjalanan"})
trxPerjalananSbm.belongsTo(sbmTranspor,{foreignKey:"kode_trx_sbm",targetKey:"kode_trx", as:"bsbmtranspor"})
perjalanan.hasMany(trxPerjalananSbm,{foreignKey:"kode_trx",targetKey:"kode_trx_perjalanan",as:"htrxsbm"})
sbmTranspor.hasMany(trxPerjalananSbm,{foreignKey:"kode_trx",targetKey:"kode_trx_transpor",as:"htrxperjalanan"})

module.exports = trxPerjalananSbm;
