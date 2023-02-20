const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const refPerjalanan = require("./ref_perjalanan");
const refSBMTransporPerjadin = require("./ref_sbm_transpor_perjadin")

const { DataTypes } = Sequelize;

const trxPerjalananSbm = db.define(
  "trxPerjalananSbm",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_perjalanan: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    kode_sbm: {
      type: DataTypes.INTEGER(11),
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
    tableName: "trx_perjalanan_sbm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

trxPerjalananSbm.belongsTo(refPerjalanan, { foreignKey: "kode_perjalanan",as:'perjalanan' });
trxPerjalananSbm.belongsTo(refSBMTransporPerjadin,{foreignKey:"kode_sbm",as:'sbmTranspor'})
refPerjalanan.hasMany(trxPerjalananSbm, { foreignKey: "kode_perjalanan", as:'trxSbm' });
refSBMTransporPerjadin.hasMany(trxPerjalananSbm, {
  foreignKey: "kode_sbm",
  as: "trxPerjalanan",
});

module.exports = trxPerjalananSbm;
