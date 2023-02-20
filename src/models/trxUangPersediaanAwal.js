const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const trxUangPersediaanAwal = db.define(
  "trxUangPersediaanAwal",
  {
    kode_unit: {
        type: DataTypes.CHAR(25),
        allowNull: false,
        primaryKey: true,
      },
    nama_unit: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    jumlah_uang_awal: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    tahun: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
      },
    kode_sptd: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    nomor_sptd: {
        type: DataTypes.CHAR(25),
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
    tableName: "trx_uang_persediaan_awal",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);



module.exports = trxUangPersediaanAwal;
