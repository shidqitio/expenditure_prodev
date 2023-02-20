const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;
const db = require("../config/database");

const KehadiranPetugasPerjadin = db.define(
  "KehadiranPetugasPerjadin",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement:true
    },
    kode_surat: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      allowNull: false,
    },
    kode_kota_tujuan: {
      type: DataTypes.CHAR(14),
      allowNull: false,
      primaryKey: true,
    },
    detail: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ucr: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "trx_kehadiran_petugas_perjadin",
     timestamps: false,
     createdAt: false,
     updatedAt: false,
  }
);


module.exports = KehadiranPetugasPerjadin;
