const { Sequelize } = require("sequelize");
const db = require("../config/database");
const katagori = require("./ref_katagori_perjadin");

const { DataTypes } = Sequelize;

const refPerjalanan = db.define(
  "refPerjalanan",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement:true
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
    transpor: {
        type: DataTypes.ENUM('HYBRID','UDARA','DARAT','LAUT'),
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
    tableName: "ref_perjalanan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refPerjalanan.belongsTo(katagori,{foreignKey:"kode_trx_katagori",targetKey:"kode_trx",as:"bkatagori"})
katagori.hasMany(refPerjalanan,{foreignKey:"kode_trx",targetKey:"kode_trx_katagori",as:"hperjalanan"})

module.exports = refPerjalanan;
