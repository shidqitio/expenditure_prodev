const db = require("../../config/database");
const { DataTypes } = require("sequelize");
const SuratExpenditure = require("../ref_surat_expenditure")


const SuratPerintahTransferDana = db.define(
  "SuratPerintahTransferDana",
  {
    kode_sptd: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nomor_rekening_asal: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_bank_asal: {
      type: DataTypes.CHAR(5),
      allowNull: true,
    },
    kode_nomor_sptd: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    nomor_sptd: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_trx_panutan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
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
    tableName: "ref_surat_perintah_transfer_dana",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


module.exports = SuratPerintahTransferDana;
