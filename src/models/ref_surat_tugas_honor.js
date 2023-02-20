const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Status = require("./ref_status");
const HonorPanitiaKegiatan = require("./trx_petugas_honorarium/trx_petugas_honor_panitia_kegiatan");
const HonorPangisiKegiatan = require("./trx_petugas_honorarium/trx_petugas_honor_pangisi_kegiatan");
const HonorPenulisSoal = require("./trx_petugas_honorarium/trx_petugas_honor_penulis_soal");
const HonorariumPetugas = require("./trx_petugas_honorarium/trx_petugas_honorarium_all");
const komentarRevisi = require("./komentar_revisi")

const { DataTypes } = Sequelize;

const SuratTugasHonor = db.define(
  "SuratTugasHonor",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    id_surat_panutan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    kode_kegiatan_ut_detail: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    kode_aktivitas_rkatu: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: true,
    },
    kode_rka: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: true,
    },
    kode_periode: {
      type: DataTypes.STRING(11),
      primaryKey: true,
      allowNull: true,
    },
    nomor_surat: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tanggal_surat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    kode_unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    id_sub_unit: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_status: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    perihal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    penandatangan: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    jenis_honor: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nama_honor: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    path_sk: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nomor_spm: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    data_pengusulan: {
      type: DataTypes.ENUM("TRANSAKSI-HISTORIS", "TRANSAKSI-BARU"),
      allowNull: false,
      defaultValue: "TRANSAKSI-BARU",
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
    tableName: "ref_surat_tugas_honor",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

Status.hasMany(SuratTugasHonor,{foreignKey:"kode_status",as:"Status"});

SuratTugasHonor.belongsTo(Status, {
  foreignKey: "kode_status",
  as: "status",
});

SuratTugasHonor.hasMany(komentarRevisi, {
  foreignKey: "kode_ruangan",targetKey:"kode_trx",
  as:"komentar"
});

SuratTugasHonor.hasMany(HonorariumPetugas,{foreignKey:"kode_trx_surat",targetKey:"kode_trx",as:"honor_petugas", include:['refSBM','refPajak']})
SuratTugasHonor.hasMany(HonorPanitiaKegiatan,{foreignKey:"kode_trx_surat",targetKey:"kode_trx",as:"honor_panitia", include:['refSBM','refPajak']})
SuratTugasHonor.hasMany(HonorPangisiKegiatan,{foreignKey:"kode_trx_surat",targetKey:"kode_trx",as:"honor_pengisi"})
SuratTugasHonor.hasMany(HonorPenulisSoal,{foreignKey:"kode_trx_surat",targetKey:"kode_trx",as:"honor_penulis_soal"})
HonorPanitiaKegiatan.belongsTo(SuratTugasHonor,{foreignKey:"kode_trx_surat",targetKey:"kode_trx",as:"sk_panitia"})


module.exports = SuratTugasHonor;
