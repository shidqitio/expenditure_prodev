const { Sequelize } = require("sequelize");
const db = require("../config/database");
const KomponenPerjadin = require("./trx_komponen_perjadin")

const { DataTypes } = Sequelize;

const PetugasPerjadin = db.define(
  "PetugasPerjadin",
  {
    kode_petugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    nama_petugas: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    id_petugas: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    nama_bank: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kode_bank_asal: {
      type: DataTypes.CHAR(3),
      allowNull: false,
    },
    nomor_rekening: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    eselon: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    gol: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    npwp: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    kekurangan_dan_pengembalian: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status_pengusulan: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    status_kurang_dan_lebih: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    status_sppd: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    urut_tugas: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    transpor: {
      type: DataTypes.ENUM("DARAT", "LAUT", "UDARA"),
      allowNull: true
    },
  },
  {
    tableName: "trx_petugas_perjadin",
    timestamps: false,
  }
);

PetugasPerjadin.hasMany(KomponenPerjadin, { foreignKey: "kode_petugas",as:'komponenPetugas' });

module.exports = PetugasPerjadin;
