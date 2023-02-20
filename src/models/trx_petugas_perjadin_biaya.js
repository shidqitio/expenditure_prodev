const { Sequelize } = require("sequelize");
const db = require("../config/database");
const KehadiranPetugasPerjadin = require("./trx_kehadiran_petugas_perjadin");
const { DataTypes } = Sequelize;

const PetugasPerjadinBiaya = db.define(
  "PetugasPerjadinBiaya",
  {
    id_surat_tugas: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(25),
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
    urut_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_trx:{
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    nama_petugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
      
    },
    nama_bank: {
      type: DataTypes.STRING(100),
      allowNull: false,
      
    },
    gol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      
    },
    eselon: {
      type: DataTypes.STRING(50),
      allowNull: false,
      
    },
    kode_bank_tujuan: {
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
    kode_bank_asal: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      
    },
    npwp: {
      type: DataTypes.CHAR(25),
      allowNull: false,
      
    },
    kode_provinsi_asal: {
      type: DataTypes.CHAR(8),
      allowNull: false,
    },
    nama_kota_asal: {
      type: DataTypes.STRING(225),
      allowNull: false,
      
    },
    kode_provinsi_tujuan: {
      type: DataTypes.CHAR(8),
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
    	kekurangan_dan_pengembalian: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      status_kurang_dan_lebih: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      status_sppd: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      keterangan_dinas:{
        type: DataTypes.STRING(50),
        allowNull: true,
        },
        dapat_diedit:{
          type: DataTypes.ENUM('BISA','TIDAK_BISA'),
          allowNull: true,
        },
        dapat_melebihi:{
          type: DataTypes.ENUM('BISA','TIDAK_BISA'),
          allowNull: true,
        }

  
  },
  {
    tableName: "trx_petugas_perjadin_biaya",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

PetugasPerjadinBiaya.hasMany(KehadiranPetugasPerjadin,{foreignKey:"kode_surat",targetKey:"id_surat_tugas",as:"kehadiran"})
KehadiranPetugasPerjadin.belongsTo(PetugasPerjadinBiaya,{foreignKey:"kode_surat",targetKey:"id_surat_tugas",as:"kehadiran"})


// PetugasPerjadinBiaya.belongsTo(SuratTugasPerjadin,{ foreignKey:"id_surat_tugas", as:"surat"});

// SuratTugasPerjadin.hasMany(PetugasPerjadinBiaya,{ foreignKey:"id_surat_tugas", as:"hsurat"});


// PetugasPerjadinBiaya.associate = async({KomponenPerjadin_1}) =>{
//   PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{ foreignKey:"nip"});
//   PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{ foreignKey:"nomor_surat_tugas", targetKey: "id_surat_tugas"});
//   PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{ foreignKey:"kode_tempat_tujuan", targetKey: "kode_kota_tujuan"});  
// }


//PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1)
// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{foreignKey:"nip"});
// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{ foreignKey:"kode_kota_tujuan"});
// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{  foreignKey:"id_surat_tugas"});


//KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya)

// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"id_surat_tugas"});
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"kode_kota_tujuan"});
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"nip"});
// PetugasPerjadinBiaya.hasMany(PetugasPerjadinBiaya,{ foreignKey:"nip"});
// PetugasPerjadinBiaya.hasMany(PetugasPerjadinBiaya,{ foreignKey:"id_surat_tugas"});


module.exports = PetugasPerjadinBiaya;
