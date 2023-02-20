const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const SbmUangHarianDN = db.define(
  "SBM_Uang_Harian",
  {
    id_provinsi: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      primaryKey: true,
      defaultValue: null,
    },
    satuan: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    luarkota: {
      type: DataTypes.DECIMAL(11),
      allowNull: true,
    },
    dalamkota: {
        type: DataTypes.DECIMAL(11),
        allowNull: true,
    },
    diklat:{
        type: DataTypes.DECIMAL(11),
        allowNull: true,
    }

    // ucr: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    // uch: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    // udcr: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
    // udch: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
    
  },
  {
    tableName: "sbm_uh_luardaerah_DN",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = SbmUangHarianDN;
