const { Sequelize } = require("sequelize");
const db = require("../config/database");
const SuratTugasPerjadin = require("./ref_surat_tugas_perjadin");
const PetugasPerjadinBiaya = require("./trx_petugas_perjadin_biaya");
const { DataTypes } = Sequelize;

const trxSPPD = db.define(
  "trxSPPD",
  {
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    kode_unit_tujuan: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      
    },
    kode_kota_tujuan: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      primaryKey: true
    },
    geolokasi: {
      type: DataTypes.STRING(225),
      allowNull: false,
      
    },
    waktulokasi: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nip_penandatangan: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    nama_penandatangan: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(100),
      allowNull: false,
      
    },
    file_link_ttd: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    file_link_foto: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },

  
  },
  {
    tableName: "trx_sppd",
    timestamps: false,
    // createdAt: "udcr",
    // updatedAt: "udch",
  }
);

//trxSPPD.belongsTo(SuratTugasPerjadin,{ targetKey:"id_surat_tugas" ,foreignKey:"kode_surat_tugas", as:"surat"});
trxSPPD.belongsTo(PetugasPerjadinBiaya,{ targetKey:"id_surat_tugas" ,foreignKey:"kode_surat_tugas", as:"surat"});
//SuratTugasPerjadin.belongsTo(trxSPPD,{ foreignKey:"id_surat_tugas", as:"hsurat"});


module.exports = trxSPPD;
