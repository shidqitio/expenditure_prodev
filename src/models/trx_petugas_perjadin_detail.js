const { Sequelize } = require("sequelize");
const db = require("../config/database");
const { DataTypes } = Sequelize;

const PetugasPerjadinDetail = db.define(
  "PetugasPerjadinDetail",
  {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
      },
    id_surat_tugas: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    kode_kota_asal: {
      type: DataTypes.CHAR(14),
      primaryKey: true,
      allowNull: false,
    },
    kode_kota_tujuan: {
      type: DataTypes.CHAR(14),
      primaryKey: true,
      allowNull: false,
    },
    nama_petugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
      
    },
    kode_bank: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      
    },
    nomor_rekening: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      
    },
    nomor_rekening_dipakai: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      
    },
    npwp: {
      type: DataTypes.CHAR(25),
      allowNull: false,
      
    },
    kode_provinsi_asal: {
      type: DataTypes.CHAR(8),
      allowNull: false,
    },
    
    kode_provinsi_tujuan: {
      type: DataTypes.CHAR(8),
      allowNull: false,
    },
    nama_kota_asal: {
        type: DataTypes.STRING(225),
        allowNull: false,
        
      },
    nama_kota_tujuan: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    kode_unit_tujuan: {
      type: DataTypes.CHAR(50),
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    tanggal_pergi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tanggal_pulang: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lama_perjalanan: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
    },
    transport: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
    biaya: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    status_pengusulan: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      keterangan_dinas:{
      type: DataTypes.STRING(50),
      allowNull: true,
      },
      kode_sppd: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },

  
  },
  {
    tableName: "trx_petugas_perjadin_detail",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);



module.exports = PetugasPerjadinDetail;
