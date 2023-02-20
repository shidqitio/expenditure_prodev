const { Sequelize } = require("sequelize");
const db = require("../config/database");
const katagori = require("./ref_katagori_perjadin");
const filter = require("./ref_filter_skema");

const { DataTypes } = Sequelize;

const trxKatagoriFilter = db.define(
  "trxKatagoriFilter",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    kode_trx_katagori: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_trx_filter: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_trx_filter_terkait: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    katagori: {
      type: DataTypes.ENUM('UANG_HARIAN','PENGINAPAN'),
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
    tableName: "trx_katagori_filter",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

trxKatagoriFilter.belongsTo(katagori,{foreignKey:"kode_trx_katagori",targetKey:"kode_trx",as:"mKatagori"})
trxKatagoriFilter.belongsTo(filter,{foreignKey:"kode_trx_filter",targetKey:"kode_trx",as:"mKFilter"})

katagori.hasMany(trxKatagoriFilter,{foreignKey:"kode_trx",targetKey:"kode_trx_katagori",as:"htrxKatagori"})
filter.hasMany(trxKatagoriFilter,{foreignKey:"kode_trx",targetKey:"kode_trx_filter",as:"htrxfilter"})

module.exports = trxKatagoriFilter;
