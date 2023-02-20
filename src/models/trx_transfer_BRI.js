const { Sequelize } = require("sequelize");
const db = require("../config/database");
const TrxResponBank = require("./trx_respon_bank");

const { DataTypes } = Sequelize;

const TrxTransferBRI = db.define(
  "trxTransferBRI",
  {
    NoReferral: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
    },
    kode_bank_asal: {
    type: DataTypes.CHAR(3),
    allowNull: true,
    },
    no_rekening_asal: {
    type: DataTypes.STRING(50),
    allowNull: true,
    },
    kode_bank_tujuan: {
    type: DataTypes.CHAR(3),
    allowNull: true,
    },
    no_rekening_tujuan: {
    type: DataTypes.STRING(50),
    allowNull: true,
    },
    nama_pemilik_rekening_tujuan: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    amount: {
    type: DataTypes.DECIMAL(20,2),
    allowNull: true,
    },
    keterangan: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    kode_dokumen: {
    type: DataTypes.STRING(225),
    allowNull: true,
    },
    batas_waktu_eksekusi: {
    type: DataTypes.DATE,
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
    tableName: "trx_transfer_bri",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

TrxTransferBRI.hasMany(TrxResponBank,{foreignKey:'noReferral'})
TrxResponBank.belongsTo(TrxTransferBRI,{foreignKey:'noReferral'})

module.exports = TrxTransferBRI;
