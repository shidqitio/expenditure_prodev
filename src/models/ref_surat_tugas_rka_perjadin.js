const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const SuratTugasRKAPerjadin = db.define(
  "SuratTugasRKAPerjadin",
  {
    id_surat_tugas: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
    },
    kode_kegiatan_ut_detail: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_aktivitas_rkatu: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    kode_RKA: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      primaryKey: true,
    },
    kode_periode: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    tanggal_surat_tugas: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    kode_unit: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    jumlah_budget: {
        type: DataTypes.DECIMAL(11,2),
        allowNull: true,
      },
      kode_status: {
        type: DataTypes.INTEGER(1),
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
    tableName: "ref_surat_tugas_rka_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = SuratTugasRKAPerjadin;
