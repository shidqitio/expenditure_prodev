const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const refSbmTransporPerjadin = db.define(
  "refSbmTransporPerjadin",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
    },
    kode_trx_sk: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    katagori_sbm: {
        type: DataTypes.ENUM('TRANSPOR KHUSUS UT PUSAT','TIKET PESAWAT','DALAM PROVINSI','TAKSI DALAM NEGERI'),
        allowNull: true,
    },
    katagori_perjadin: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_tempat_asal: {
        type: DataTypes.CHAR(16),
        allowNull: true,
    },
    asal: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    kode_tempat_tujuan: {
        type: DataTypes.CHAR(16),
        allowNull: true,
    },
    tujuan: {
        type: DataTypes.STRING(225),
        allowNull: true,
    },
    satuan: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    transpor: {
        type: DataTypes.ENUM('UDARA','DARAT','LAUT'),
        allowNull: true,
    },
    biaya_sejalan:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    biaya_pp:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    mekanisme: {
        type: DataTypes.ENUM('LUMPSUM','ATCOST'),
        allowNull: true,
    },
    mekanisme_atcost: {
        type: DataTypes.ENUM('-','TIDAK-DAPAT-MELEBIHI-SBM','DAPAT-MELEBIHI-SBM'),
        allowNull: true,
    },
    aktif: {
        type: DataTypes.ENUM('AKTIF','NON-AKTIF'),
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
    tableName: "ref_sbm_transpor_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = refSbmTransporPerjadin;
