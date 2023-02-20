const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const ref_sk = db.define(
    "ref_sk",
    {
        kode_trx_sk: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement:true
      },
      nomor_sk: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tahun: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
      },
      keterangan: {
        type: DataTypes.STRING(500),
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
      tableName: "ref_sk",
      createdAt: "udcr",
      updatedAt: "udch",
    }
  );

  module.exports = ref_sk;