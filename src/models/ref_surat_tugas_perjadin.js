const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Status = require("./ref_status");
const refPerjalananPetugas = require("./perjalanan_dinas/ref_perjalanan_petugas");
const SuratTugasExpenditure = require("./ref_surat_expenditure");
const PetugasPerjadin = require("./trx_petugas_perjadin");

const { DataTypes } = Sequelize;

const SuratTugasPerjadin = db.define(
  "SuratTugasPerjadin",
  {
    id_surat_tugas: {
      type: DataTypes.INTEGER(15),
      allowNull: true,
      defaultValue: null,
      primaryKey: true,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(15),
      allowNull: true,
      defaultValue: null,
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: true,
      primaryKey: true,
    },
    kode_unit: {
      type: DataTypes.CHAR(25),
      allowNull: true,
    },
    kode_kegiatan_ut_detail: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    kode_aktivitas_rkatu: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: true,
    },
    kode_rka: {
      type: DataTypes.CHAR(5),
      primaryKey: true,
      allowNull: true,
    },
    kode_periode: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: true,
    },
    keperluan: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    nomor_surat_tugas: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tanggal_surat_tugas: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    kode_skema: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
    },
    kode_sub_unit: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_status: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
    },
    data_pengusulan: {
      type: DataTypes.ENUM("TRANSAKSI-HISTORIS", "TRANSAKSI-BARU"),
      allowNull: true,
      defaultValue: "TRANSAKSI-BARU",
    },
    jenis_kegiatan: {
      type: DataTypes.CHAR(125),
      allowNull: true,
    },
    jenis_perjalanan: {
      type: DataTypes.ENUM("DALAM_KOTA", "LUAR_KOTA", "LUAR_NEGERI"),
      allowNull: true,
    },
    keterangan_perjadin: {
      type: DataTypes.CHAR(45),
      allowNull: true,
    },
    jumlah_orang: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
    path_dokumen: {
      type: DataTypes.STRING(225),
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
    tableName: "ref_surat_tugas_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


SuratTugasPerjadin.belongsTo(Status, {foreignKey: "kode_status", as: "statusPerjadin"});
SuratTugasPerjadin.hasMany(refPerjalananPetugas,{ foreignKey:"kode_surat_tugas",targetKey:"id_surat_tugas", as:"perjalananPetugas"});
SuratTugasPerjadin.hasMany(refPerjalananPetugas, {
  foreignKey: "kode_surat_tugas",
  targetKey: "id_surat_tugas",
  as: "tanggalpergiperjalanan",
});
SuratTugasPerjadin.hasMany(refPerjalananPetugas, {
  foreignKey: "kode_surat_tugas",
  targetKey: "id_surat_tugas",
  as: "tanggalpulangperjalanan",
});
SuratTugasPerjadin.belongsTo(SuratTugasExpenditure, {  foreignKey: "kode_surat_header",as:"suratHeader"});

SuratTugasExpenditure.hasMany(SuratTugasPerjadin, {
  foreignKey: "kode_surat_header",
  as: "SuratSPHeader",
});

module.exports = SuratTugasPerjadin;
