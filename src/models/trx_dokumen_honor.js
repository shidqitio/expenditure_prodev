const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const dokumenHonor = db.define(
  "dokumenhonor",
  {
    katagori_surat: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      primaryKey: true,
    },
    id_trx:{
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    id_surat_tugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_unit: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
    },
    jenis_surat: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    
    id_nomor: {
        type: DataTypes.CHAR(20),
        allowNull: true,
    },
    nomor: {
        type: DataTypes.CHAR(20),
        allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
      },
      aktif: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
      },
        
  },
  {
    tableName: "trx_dokumen_honor",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = dokumenHonor;
