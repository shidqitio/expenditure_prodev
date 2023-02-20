const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const PerjalananPerjadin = require("./ref_perjalanan_petugas_awal")

const { DataTypes } = Sequelize;

const trx_petugas_perjadin_awal = db.define(
  "trx_petugas_perjadin_awal",
  {
    kode_petugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nama_petugas: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_petugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    eselon: {
      type: DataTypes.ENUM("I", "II", "III", "IV", "-"),
      allowNull: false,
    },
    gol: {
      type: DataTypes.ENUM("I", "II", "III", "IV", "-"),
      allowNull: false,
    },
    kode_bank: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    nomor_rekening: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    atas_nama_rekening: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    tableName: "trx_petugas_perjadin_awal",
    timestamps: false,
  }
);

PerjalananPerjadin.hasMany(trx_petugas_perjadin_awal, {
  foreignKey: "kode_perjalanan",
  as: "PetugasPerjadin",
});

trx_petugas_perjadin_awal.belongsTo(PerjalananPerjadin, {
  foreignKey: "kode_perjalanan",
  as: "PerjalananPerjadin",
});


module.exports = trx_petugas_perjadin_awal;
