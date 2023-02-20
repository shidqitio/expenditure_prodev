const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const fileRealisasiPerjadin = db.define(
  "fileRealisasiPerjadin",
  {
    kode_trx:{
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_surat_tugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    kode_komponen_honor: {
      type: DataTypes.STRING(1),
      allowNull: false,
      primaryKey: true,
    },
    kode_kota_tujuan: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    
    tahun: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
      },
      biaya: {
        type: DataTypes.INTEGER(21),
        allowNull: true,
      },
  },
  {
    tableName: "trx_file_realisasi_perjadin",
     timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = fileRealisasiPerjadin;
