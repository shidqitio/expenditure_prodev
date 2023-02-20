const { Sequelize, fn,col } = require("sequelize");
const db = require("../../config/database");

const ref_sbm_studi_lanjut = require("./ref_studi_lanjut")

const { DataTypes } = Sequelize;

const trx_pegawai_studi_lanjut = db.define(
  "trx_pegawai_studi_lanjut",
  {
    kode_trx:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_ref_studi_lanjut:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
      foreignKey:true
    },
    nip: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    nama:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    tahun: {
        type: DataTypes.CHAR(4),
        allowNull: true
    },
    npwp:{
      type: DataTypes.STRING(50),
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
    volume_1:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    jumlah:{
        type: DataTypes.DECIMAL(16,2),
        allowNull: true,
    },
    atas_nama_rekening:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    nomor_surat_tugas : {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan:{
        type: DataTypes.STRING(100),
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
    tableName: "trx_pegawai_studi_lanjut",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

// ref_sbm_studi_lanjut.hasMany(trx_pegawai_studi_lanjut, {
//     foreignKey : "kode_ref_studi_lanjut",
//     as : 'TrxStudiLanjut'
// })

// trx_pegawai_studi_lanjut.belongsTo(ref_sbm_studi_lanjut, {
//     foreignKey : 'kode_trx',
//     targetKey : 'kode_ref_studi_lanjut',
//     as : 'RefStudiLanjut'
// })



module.exports = trx_pegawai_studi_lanjut;
