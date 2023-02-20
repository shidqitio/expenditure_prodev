const { Sequelize } = require("sequelize");
const db = require("../config/database");
const PetugasPerjadinBiaya = require("./trx_petugas_perjadin_biaya");
const { DataTypes } = Sequelize;

const KomponenPerjadin_1 = db.define(
  "KomponenPerjadin_1",
  {
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
      allowNull: false,
      primaryKey: true,
    },
    urut_tugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_komponen_honor: {
      type: DataTypes.STRING(1),
      allowNull: false,
      primaryKey: true,
    },
    keterangan_komponen: {
      type: DataTypes.STRING(150),
      allowNull: false,
      primaryKey: true,
    },
    kode_satuan: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement:true
    },
    biaya_satuan: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
    },
    pajak_persen: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: true,
    },
    jumlah_pajak: {
        type: DataTypes.DECIMAL(10,0),
        allowNull: true,
      },
    jumlah: {
    type: DataTypes.INTEGER(3),
    allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      },
      satuan_sbm:{
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
      },
    total: {
        type: DataTypes.DECIMAL(20,2),
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
    tableName: "trx_komponen_perjadin_1",
     timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);


// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1);
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya);

// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{  foreignKey:"id_surat_tugas"})
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"id_surat_tugas"})
// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{foreignKey:"nip"})
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"nip"})
// PetugasPerjadinBiaya.hasMany(KomponenPerjadin_1,{ foreignKey:"kode_kota_asal"})
// KomponenPerjadin_1.belongsTo(PetugasPerjadinBiaya,{ foreignKey:"kode_kota_asal"})


module.exports = KomponenPerjadin_1;
