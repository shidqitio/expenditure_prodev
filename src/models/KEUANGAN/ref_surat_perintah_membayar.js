const db = require("../../config/database");
const { DataTypes } = require("sequelize");
const SuratExpenditure = require("../ref_surat_expenditure");

const SuratPerintahMembayar = db.define(
  "SuratPerintahMembayar",
  {
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    kode_nomor_spm: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    nomor_spm: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_unit: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PROSES", "BATAL", "SELESAI"),
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
    tableName: "ref_surat_perintah_membayar",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SuratPerintahMembayar.belongsTo(SuratExpenditure, {
  foreignKey: "kode_surat_header",
  as: "SuratHeaderSPM",
});

SuratExpenditure.hasMany(SuratPerintahMembayar, {
  foreignKey: "kode_surat_header",
  as: "SuratSPMHeader",
});

module.exports = SuratPerintahMembayar;
