const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const KomponenPerjadin = db.define(
  "KomponenPerjadin",
  {
    kode_komponen: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_petugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_kategori: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    kategori_sbm: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    transpor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    kode_satuan: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    biaya_satuan: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },
    jumlah_satuan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    mekanisme: {
      type: DataTypes.ENUM("LUMPSUM", "ATCOST"),
      allowNull: true,
    },
    mekanisme_atcost: {
      type: DataTypes.ENUM("TIDAK_DAPAT_MELEBIHI_SBM", "DAPAT_MELEBIHI_SBM"),
      allowNull: true,
    },
  },
  {
    tableName: "trx_komponen_perjadin",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = KomponenPerjadin;
