const { Sequelize } = require("sequelize");
const db = require("../config/database");
const SuratTugasPerjadin = require("./ref_surat_tugas_perjadin");
const { DataTypes } = Sequelize;
const SuratBarjas = require("./ref_surat_barjas")

const waitingTransfer = db.define(
  "WaitingTransferexpenditure",
  {

    nomor_spm:{
      type: DataTypes.CHAR(225),
      allowNull: true,
    },
    kode_nomor_spm:{
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    tanggal_spm:{
      type: DataTypes.DATE,
      allowNull: true,
    },
      nip:{
        type: DataTypes.CHAR(225),
        allowNull: true,
        primaryKey:true,
      },
      nama:{
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      nomor_rekening:{
        type: DataTypes.CHAR(225),
        allowNull: true,
      },
      nomor_rekening_dipakai:{
        type: DataTypes.CHAR(225),
        allowNull: true,
      },
      kode_bank_asal:{
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      nama_bank:{
        type: DataTypes.CHAR(100),
        allowNull: true,
      },
      kode_bank:{
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      jumlah:{ 
        type: DataTypes.BIGINT(25),
        allowNull: true,
      },
      pajak_potongan:{ 
        type: DataTypes.BIGINT(25),
        allowNull: true,
      },
      kode_surat:{
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey:true,
      },
      sub_surat:{
        type: DataTypes.STRING(225),
        allowNull: true,
        primaryKey:true,
      },
      perihal:{
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      tahun:{
        type: DataTypes.INTEGER(4),
        allowNull: true,
        primaryKey:true,
      },
      kode_unit:{
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      status:{
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      MAK:{
        type: DataTypes.CHAR(11),
        allowNull: true,
      },
      akun_bas_rka:{
        type: DataTypes.CHAR(6),
        allowNull: true,
      },
      akun_bas_realisasi:{
        type: DataTypes.CHAR(6),
        allowNull: true,
      },
      kode_nomor:{
        type: DataTypes.CHAR(11),
        allowNull: true,
      },
      nomor_sptd:{
        type: DataTypes.CHAR(100),
        allowNull: true,
      },
      NoReferral:{
        type: DataTypes.BIGINT(25),
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
    tableName: "trx_waiting_list_transfer",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


SuratTugasPerjadin.hasMany(waitingTransfer,{foreignKey:"kode_surat",targetKey:"id_surat_tugas", as:"hsuratwaiting"});
waitingTransfer.belongsTo(SuratTugasPerjadin,{foreignKey:"kode_surat",targetKey:"id_surat_tugas", as:"suratwaiting"});
waitingTransfer.belongsTo(SuratBarjas,{foreignKey:"kode_surat",targetKey:"kode_permintaan", as:"suratwaitingbarjas"});

module.exports = waitingTransfer;
