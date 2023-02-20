const { Sequelize } = require("sequelize");
const db = require("../../config/database");


const { DataTypes } = Sequelize;

const trx_petugas_honor_ttm = db.define(
  "trx_petugas_honor_ttm",
  {
    kode_trx:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_trx_surat:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
    },
    tahun: {
        type: DataTypes.CHAR(4),
        allowNull: true,
        primaryKey: true,
      },
    nip: {
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey: true,
      },
    nama:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    gol: {
        type: DataTypes.CHAR(5),
        allowNull: true,
    },
    npwp:{
      type: DataTypes.STRING(50),
      allowNull: true,
     },
    tugas:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    pokjar:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    satuan_biaya:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    satuan:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    volume:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    jumlah_biaya:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    pajak:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    diterima:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    kode_bank:{
        type: DataTypes.CHAR(3),
        allowNull: true,
    },
    nama_bank:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    no_rekening:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    atas_nama_rekening:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    status:{
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
    tableName: "trx_petugas_honor_ttm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = trx_petugas_honor_ttm;
