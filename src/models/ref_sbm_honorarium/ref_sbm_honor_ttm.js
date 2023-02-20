const { Sequelize } = require("sequelize");
const db = require("../../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_honor_ttm = db.define(
  "ref_sbm_honor_ttm",
  {
    tugas: {
      type: DataTypes.STRING(100),
      allowNull: true,
      primaryKey: true,
    },
    jenjang: {
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey: true,
      },
    jabatan: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
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
    tableName: "ref_sbm_honor_ttm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_honor_ttm;
