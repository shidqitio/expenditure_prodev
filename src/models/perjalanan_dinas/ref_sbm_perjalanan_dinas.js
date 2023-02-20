const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const refSBMPerjadin = db.define(
  "refSBMPerjadin",
  {
    kode_sbm: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kategori_sbm: {
      type: DataTypes.ENUM(
        "UANG_HARIAN_DALAM_NEGERI",
        "PENGINAPAN"
      ),
      allowNull: true,
    },
    kode_provinsi: {
      type: DataTypes.CHAR(8),
      allowNull: true,
    },
    satuan: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    eselon: {
      type: DataTypes.ENUM("I", "II", "III", "IV", "-"),
      allowNull: true,
      defaultValue: "-",
    },
    gol: {
      type: DataTypes.ENUM("I", "II", "III", "IV", "-"),
      allowNull: true,
      defaultValue: "-",
    },
    kategori_skema: {
      type: DataTypes.ENUM(
        "LUAR KOTA",
        "DIKLAT",
        "DALAM KOTA > 8 JAM",
        "HALFDAY",
        "FULLDAY",
        "FULLBOARD",
        "-"
      ),
      allowNull: true,
      defaultValue: "-",
    },
    kode_trx_sk : {
      type : DataTypes.BIGINT(25),
      allowNull : true
    },
    kode_sk : {
      type : DataTypes.STRING(25),
      allowNull : true
    },
    biaya: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    mekanisme: {
      type: DataTypes.ENUM("LUMPSUM", "ATCOST"),
      allowNull: true,
      defaultValue: "ATCOST",
    },
    makanisme_atcost: {
      type: DataTypes.ENUM(
        "-",
        "TIDAK-DAPAT-MELEBIHI-SBM",
        "DAPAT-MELEBIHI-SBM"
      ),
      allowNull: true,
      defaultValue: "-",
    },
    aktif: {
      type: DataTypes.ENUM("AKTIF", "NON-AKTIF"),
      allowNull: true,
      defaultValue: "AKTIF",
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
    tableName: "ref_sbm_perjalanan_dinas",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = refSBMPerjadin;
