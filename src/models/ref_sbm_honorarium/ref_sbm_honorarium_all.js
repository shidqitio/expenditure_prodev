const { Sequelize } = require("sequelize");
const db = require("../../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_honorarium_all = db.define(
  "ref_sbm_honorarium_all",
  {
    kode_trx:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
    },
    kode_klasifikasi: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    katagori: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    tugas: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    jenjang:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    gol:{
        type: DataTypes.CHAR(5),
        allowNull: true,
    },
    eselon:{
        type: DataTypes.CHAR(5),
        allowNull: true,
    },
    jabatan:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    nomor_sk : {
      type : DataTypes.STRING(100),
      allowNull : true
    },
    satuan:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    satuan_biaya: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    keterangan:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    aktif : {
      type : DataTypes.ENUM('Y','N'),
      allowNull : true
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
    tableName: "ref_sbm_honorarium_all",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_honorarium_all;
