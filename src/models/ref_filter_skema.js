const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const refFilterSkema = db.define(
  "refFilterSkema",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    katagori: {
      type: DataTypes.ENUM('UANG_HARIAN','PENGINAPAN'),
      allowNull: true,
    },
    jenis_filter: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    mekanisme:{
      type: DataTypes.ENUM('BISA','TIDAK_BISA'),
      allowNull: true,
    },
    bisa_lebih:{
      type: DataTypes.ENUM('BISA','TIDAK_BISA'),
      allowNull: true,
    },
    persen_dari_sbm: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    satuan: {
      type: DataTypes.STRING(50),
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
    tableName: "ref_filter_skema",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = refFilterSkema;
