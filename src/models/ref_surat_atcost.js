const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const SuratAtcost = db.define(
  "SuratAtcost",
  {
    kode_surat: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: true,
      autoIncrement : true
    },
    kode_surat_header : {
      type : DataTypes.INTEGER(11),
      allowNull : true
    },
    kode_trx_spj: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    nomor_surat: {
      type: DataTypes.CHAR(100),
      primaryKey: true,
      allowNull: true,
    },
    perihal: {
      type: DataTypes.STRING(225),
      primaryKey: true,
      allowNull: true,
    },
    tanggal_surat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    kode_unit: {
      type: DataTypes.CHAR(25),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: true,
      primaryKey: true,
    },
    kode_status: {
      type: DataTypes.INTEGER(2),
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
    tableName: "ref_surat_atcost",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


module.exports = SuratAtcost;
