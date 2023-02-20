const { Sequelize } = require("sequelize");
const db = require("../config/database");
const dokumenKirimPanutan = require("./trx_dokumen_kirim_ke_panutan");
const { DataTypes } = Sequelize;

const refSPM = db.define(
  "refSPM",
  {
    kode_trx: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
    kode_nomor_spm: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    nomor_spm: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_trx_sptd: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_trx_panutan: {
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
    tableName: "ref_spm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refSPM.belongsTo(dokumenKirimPanutan,{foreignKey:'kode_trx_panutan',targetKey:"id_trx", as:"dokumenpanutan"})

module.exports = refSPM;
