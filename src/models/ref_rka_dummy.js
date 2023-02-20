const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const RkaDummy = db.define(
  "RkaDummy",
  {
    kode_RKA: {
      type: DataTypes.STRING(5),
      allowNull: true,
      primaryKey: true,
    },
    keterangan: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    jumlah: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
      akun: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  },
  {
    tableName: "ref_rka_dummy",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = RkaDummy;
