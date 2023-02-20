const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const TokenBRI = db.define(
  "TokenBRI",
  {
    id_trx: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
      },
    kode_token: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    modul_token: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    access_token: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    token_create: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    expired_in: {
        type: DataTypes.DATE,
        allowNull: true,
    },

  },
  {
    tableName: "token_BRI",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = TokenBRI;
