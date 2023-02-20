const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const refSBMTransporPerjadin = db.define(
  "refSBMTransporPerjadin",
  {
    kode_sbm: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_komponen: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    katagori_sbm: {
      type: DataTypes.ENUM(
        "TRANSPOR KHUSUS UT PUSAT",
        "TIKET PESAWAT",
        "DALAM PROVINSI",
        "TAKSI DALAM NEGERI"
      ),
      allowNull: true,
      default: "TIKET PESAWAT",
    },
    kode_tempat_asal: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    asal: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_tempat_tujuan: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    tujuan: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    transpor: {
      type: DataTypes.ENUM("UDARA", "DARAT", "LAUT"),
      allowNull: true,
    },
    satuan: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    biaya_sejalan: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    biaya_pp: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    mekanisme: {
      type: DataTypes.ENUM("LUMPSUM", "ATCOST"),
      allowNull: true,
      default: "ATCOST",
    },
    mekanisme_atcost: {
      type: DataTypes.ENUM(
        "-",
        "TIDAK-DAPAT-MELEBIHI-SBM",
        "DAPAT-MELEBIHI-SBM"
      ),
      allowNull: true,
      default: "-",
    },
    aktif: {
      type: DataTypes.ENUM("AKTIF", "NON-AKTIF"),
      allowNull: true,
      default: "AKTIF",
    },
    kode_sk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: "0",
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
    tableName: "ref_sbm_transpor_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = refSBMTransporPerjadin;
