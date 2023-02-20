const { Sequelize } = require("sequelize");
const db = require("../../config/database");


const { DataTypes } = Sequelize;

const ref_sbm_honorarium_panitia_kegiatan = db.define(
  "ref_sbm_honorarium_panitia_kegiatan",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    tugas: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gol: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
    satuan:{
        type: DataTypes.CHAR(2),
        allowNull: true,
    },
    besaran: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    nomor_sk : {
      type : DataTypes.STRING(100),
      allowNull : true
    },
    status : {
      type : DataTypes.ENUM('0','1'),
      allowNull : true
    },
    tahun : {
      type : DataTypes.INTEGER(4), 
      allowNull : true
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
    tableName: "ref_sbm_honorarium_panitia_kegiatan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_sbm_honorarium_panitia_kegiatan;
