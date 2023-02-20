const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const SuratTugasPerjadin = require('./ref_surat_tugas_perjadin_awal')

const { DataTypes } = Sequelize;

const ref_perjalanan_petugas_awal = db.define(
  "ref_perjalanan_petugas_awal",
  {
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_tempat_asal: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    kode_tempat_tujuan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tanggal_pergi: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    tanggal_pulang: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    detail_lokasi: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    keterangan_penugasan: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    ucr: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uch: {
      type: DataTypes.STRING(255),
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
    tableName: "ref_perjalanan_petugas_awal",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SuratTugasPerjadin.hasMany(ref_perjalanan_petugas_awal, {
  foreignKey: "kode_surat_tugas",
  as: "PerjalananPerjadin",
});

ref_perjalanan_petugas_awal.belongsTo(SuratTugasPerjadin, {
  foreignKey: "kode_surat_tugas",
  as: "SuratTugasPerjadin",
});

module.exports = ref_perjalanan_petugas_awal;
