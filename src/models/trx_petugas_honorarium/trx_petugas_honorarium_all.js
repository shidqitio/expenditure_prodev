const { Sequelize, fn,col } = require("sequelize");
const db = require("../../config/database");

const refSBM = require("../ref_sbm_honorarium/ref_sbm_honorarium_all")
const refPajak = require("../ref_sbm_honorarium/ref_pajak_honorarium");

const { DataTypes } = Sequelize;

const trx_petugas_honorarium_all = db.define(
  "trx_petugas_honorarium_all",
  {
    kode_petugas : {
        type : DataTypes.INTEGER(11),
        allowNull : false, 
        primaryKey : true,
        autoIncrement : true
    },
    kode_surat_header:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      foreignKey:true
    },
    kode_trx_sbm:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      foreignKey:true
    },
    kode_trx_pajak:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      foreignKey:true
    },
    kode_klasifikasi:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    nip: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    kode_surat: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
     tahun: {
        type: DataTypes.CHAR(4),
        allowNull: true
      },
    katagori:{
    type: DataTypes.STRING(100),
    allowNull: true,
    },
    tugas:{
      type: DataTypes.STRING(100),
      allowNull: true,
     },
    jenjang:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
     gol: {
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
    nama:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email:{
      type: DataTypes.STRING(100),
      allowNull: true,
  },
    npwp:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    satuan_1:{
        type: DataTypes.CHAR(15),
        allowNull: true,
    },
    volume_1:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    satuan_2:{
        type: DataTypes.CHAR(15),
        allowNull: true,
    },
    volume_2:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    satuan_biaya:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    jumlah_biaya:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    pajak:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    jumlah_diterima:{
        type: DataTypes.DECIMAL(20,2),
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
    keterangan_1:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_2:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_3:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_4:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_5:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_6:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_7:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_8:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_9:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_10:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_11:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_12:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_13:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_14:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_15:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    kode_status:{
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
    tableName: "trx_petugas_honorarium_all",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

trx_petugas_honorarium_all.belongsTo(refSBM,{foreignKey:"kode_trx_sbm",targetKey:"kode_trx",as:"refSBM"})
trx_petugas_honorarium_all.belongsTo(refPajak,{foreignKey:"kode_trx_pajak",targetKey:"kode_trx",as:"refPajak"})


module.exports = trx_petugas_honorarium_all;
