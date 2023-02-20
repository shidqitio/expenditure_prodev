const db = require("../../config/database");
const { DataTypes } = require("sequelize");
const SuratExpenditure = require("../ref_surat_expenditure");

const SuratPencairanDanaUnit = db.define(
  "SuratPencairanDanaUnit",
  {
    kode_sppdu: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_nomor_pencairan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    nomor_pencairan: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_unit: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.DATE,
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
    tableName: "ref_surat_pencairan_dana_unit",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = SuratPencairanDanaUnit;
