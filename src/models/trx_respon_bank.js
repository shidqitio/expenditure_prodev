const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const TrxResponBank = db.define(
  "trxResponBank",
  {
    id_trx_respon: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
    },
    Kode_Bank: {
    type: DataTypes.CHAR(3),
    allowNull: true,
    },
    NoReferral: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    },
    StatusCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    },
    ResponseCode: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    ResponseDescription: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    ErrorDescription: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    status: {
    type: DataTypes.STRING(7),
    allowNull: true,
    },
    udcr: {
    type: DataTypes.DATE,
    allowNull: true,
    },
  },
  {
    tableName: "trx_respon_bank",
    createdAt: "udcr",
    updatedAt: false,
  }
);

module.exports = TrxResponBank;
