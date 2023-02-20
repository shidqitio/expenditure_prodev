const { Sequelize } = require("sequelize");
const db = require("../config/database");
const KomponenPerjadin = require("./ref_komponen_perjadin");
const KomponenPerjadin_1 = require("./ref_komponen_perjadin_1");

const { DataTypes } = Sequelize;

const trxKomponenPerjadin = db.define(
  "trxKomponenPerjadin",
  {
    kode_skema_perjadin : {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
    },
    kode_komponen_perjadin: {
      type: DataTypes.CHAR(5),
      primaryKey: true,
      allowNull: false,
    },
    Redaksi: {
      type: DataTypes.STRING(150),
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
    tableName: "trx_komponen_skema_perjadin",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);


  trxKomponenPerjadin.belongsTo(KomponenPerjadin_1,{foreignKey: "kode_komponen_perjadin",as: "komponen1",})
  trxKomponenPerjadin.belongsTo(KomponenPerjadin,{foreignKey: "kode_komponen_perjadin",as: "komponen",})
  KomponenPerjadin.hasMany(trxKomponenPerjadin,{foreignKey: "kode_komponen_perjadin",as: "komponen",})






module.exports = trxKomponenPerjadin;
