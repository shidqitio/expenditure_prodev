const { Sequelize } = require("sequelize");
const db = require("../config/database");
const dokumenKirimPanutan = require("./trx_dokumen_kirim_ke_panutan");
const { DataTypes } = Sequelize;

const refSPTD = db.define(
  "ref_sptd",
  {
    kode_surat_trx: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
    kode_nomor: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    nomor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nomor_rekening_asal: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kode_bank_asal: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    kode_rka: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    kode_periode: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    status: {
      type: DataTypes.CHAR(3),
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
    tableName: "ref_sptd",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);
//Kabko.belongsTo(Provinsi,{targetKey: 'kode_provinsi',foreignKey:"kode_provinsi", as:"provinsi"})
refSPTD.belongsTo(dokumenKirimPanutan,{targetKey:'id_nomor',foreignKey:"kode_nomor", as:"dokumen"})

module.exports = refSPTD;
