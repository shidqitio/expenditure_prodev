const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const trxSbmPenginapan = db.define(
  "trxSbmPenginapan",
  {
    trx_penginapan: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    penginapan: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    keterangan_malam: {
        type: DataTypes.INTEGER(3),
        allowNull: false
    },
     eselon: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
     golongan: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    mekanisme: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    harga_satuan: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: false
    }
  },
  {
    tableName: "trx_sbm_penginapan",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = trxSbmPenginapan;