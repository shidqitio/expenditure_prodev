const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const trxVAPerjadin = db.define(
  "virtualAcount",
  {
    kode_bank: {
        type: DataTypes.CHAR(3),
        allowNull: true,
        primaryKey: true,
      },
    kode_VA: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      primaryKey: true,
    },
    kode_surat: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    nip: {
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
    kode_sub_surat: {
        type: DataTypes.CHAR(50),
        allowNull: true,
    },
    nominal: {
        type: DataTypes.BIGINT(25),
        allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("BELUM-DIBAYAR", "SUDAH-DIBAYAR"),
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
    tableName: "trx_va_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = trxVAPerjadin;
