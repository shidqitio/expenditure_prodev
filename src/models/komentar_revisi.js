const { Sequelize } = require("sequelize");
const db = require("../config/database");
const SuratTugasExpenditure = require("./ref_surat_expenditure");

const { DataTypes } = Sequelize;

const komentar_revisi = db.define(
  "komentar_revisi",
  {
    kode_komentar: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(15),
      allowNull: true,
      defaultValue: null,
    },
    kode_surat: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_ruangan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    komentar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aktif: {
      type: DataTypes.ENUM("AKTIF", "TIDAK_BISA"),
      allowNull: true,
    },

    ucr: {
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
    tableName: "komentar_revisi",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SuratTugasExpenditure.hasMany(komentar_revisi, {
  foreignKey: "kode_surat_header",as:'KomentarRevisi'
});

module.exports = komentar_revisi;
