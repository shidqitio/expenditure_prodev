const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_lembur = db.define(
  "ref_sbm_lembur",
  {
    golongan: {
      type: DataTypes.STRING(5),
      allowNull: true,
      primaryKey: true,
    },
    jenis_pegawai: {
        type: DataTypes.STRING(10),
        allowNull: true,
        primaryKey: true,
    },
    teknisi: {
      type: DataTypes.ENUM('-','TEKNISI','NON-TEKNISI'),
      allowNull: true,
      primaryKey: true
    },
    satuan:{
        type: DataTypes.STRING(3),
        allowNull: true,
    },
    besaran: {
        type: DataTypes.INTEGER(11),
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
    tableName: "ref_sbm_lembur",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_lembur;
