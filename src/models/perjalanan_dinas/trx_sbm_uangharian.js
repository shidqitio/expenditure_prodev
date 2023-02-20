const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const trxSbmUangharian = db.define(
  "trxSbmUangharian",
  {
    trx_uang_harian: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_surat_tugas: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    kategori: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    keterangan_hari: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
    },
    harga_satuan: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: false
    }
  },
  {
    tableName: "trx_sbm_uang_harian",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = trxSbmUangharian;