const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_kegiatan_bidang_akademik = db.define(
  "ref_sbm_kegiatan_bidang_akademik",
  {
    bentuk_kegiatan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      primaryKey: true,
    },
    sub_kegiatan: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
      },
    komponen: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
    },
    kategori: {
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
    keterangan: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
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
    tableName: "ref_sbm_kegiatan_bidang_akademik",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_kegiatan_bidang_akademik;
