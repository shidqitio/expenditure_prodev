const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const trxSbmTranspor =  db.define(
  "trxSbmTranspor",
  {
    trx_transpor: {
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
    transport: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    keterangan: {
        type: DataTypes.INTEGER(45),
        allowNull: false
    },
    kategori: {
        type: DataTypes.STRING(45),
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
    tableName: "trx_sbm_transpor",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = trxSbmTranspor;