const { Sequelize } = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const KomponenPerjadinRealisasi = db.define(
  "KomponenPerjadinRealisasi",
  {
    id_surat_tugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    kode_komponen_honor: {
      type: DataTypes.STRING(1),
      allowNull: false,
      primaryKey: true,
    },
    kode_kota_asal: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    
    total: {
        type: DataTypes.DECIMAL(10,0),
        allowNull: true,
    },
    terpakai: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true,
      },
      sisa_biaya: {
        type: DataTypes.DECIMAL(10,0),
        allowNull: true,
        },
        tahun: {
          type: DataTypes.INTEGER(4),
          primaryKey: true,
          allowNull: false,
        },
    
  },
  {
    tableName: "trx_komponen_perjadin_realisasi",
     timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = KomponenPerjadinRealisasi;
