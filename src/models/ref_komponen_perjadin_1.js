const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const KomponenPerjadin_1 = db.define(
  "KomponenPerjadin",
  {
    kode_komponen_perjadin: {
      type: DataTypes.STRING(3),
      allowNull: true,
      primaryKey: true,
    },
    nama_komponen_perjadin: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    keterangan: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    kode_satuan: {
        type: DataTypes.CHAR(50),
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
    tableName: "ref_komponen_perjadin_1",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = KomponenPerjadin_1;
