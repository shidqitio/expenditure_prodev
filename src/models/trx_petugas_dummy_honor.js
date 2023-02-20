const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const PetugasDummyHonor = db.define(
  "PetugasDummyHonor",
  {
    id_unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    id_surat: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
    },
    id_surat: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    nama: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: true,
    },
    peran: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    gol: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    npwp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    satuan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    volume: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    honor: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pph: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    terima: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "trx_pertugas_dummy_honor",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = PetugasDummyHonor;
