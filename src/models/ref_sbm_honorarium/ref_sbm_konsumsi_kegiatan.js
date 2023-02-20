const { Sequelize } = require("sequelize");
const db = require("../../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_konsumsi_kegiatan = db.define(
  "ref_sbm_konsumsi_kegiatan",
  {
    kegiatan: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
    },
    jenis_konsumsi: {
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey: true,
      },
    besaran: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    satuan:{
        type: DataTypes.STRING(3),
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
    tableName: "ref_sbm_konsumsi_kegiatan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_konsumsi_kegiatan;
