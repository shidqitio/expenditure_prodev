const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const trxKomponenSuper = db.define(
  "trxKomponenSuratPerjadin",
  {
    kode_tksp : {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_rpsp: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_komponen_perjadin: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      primaryKey: true,
    },
    tahun: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        allowNull: false,
      },
    biaya_satuan: {
        type: DataTypes.BIGINT(25),
        allowNull: false,
    },
    jumlah_satuan: {
      type: DataTypes.FLOAT(11,2),
      allowNull: false,
  },
    biaya: {
        type: DataTypes.BIGINT(25),
        allowNull: false,
    },
    keterangan:{
      type: DataTypes.CHAR(25),
        primaryKey: true,
        allowNull: false,
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
    tableName: "trx_komponen_surat_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);







module.exports = trxKomponenSuper;
