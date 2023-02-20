const { Sequelize } = require("sequelize");
const db = require("../config/database");
const dokumenKirimPanutan = require("./trx_dokumen_kirim_ke_panutan");


const { DataTypes } = Sequelize;

const SuratBarjas = db.define(
  "SuratBarjas",
  {
    kode_surat : {
      type : DataTypes.INTEGER(11),
      allowNull : true,
      autoIncrement : true
    },
    kode_surat_header : {
      type : DataTypes.INTEGER(11),
      allowNull : true
    },
    kode_permintaan: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
    kode_kontrak: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
    kode_vendor: {
        type: DataTypes.STRING(50),
        allowNull: true,
        primaryKey: true,
      },
      nomor_surat: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tahun: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        primaryKey: true,
      },
      aplikasi: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      kode_rup: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      nomor_rup: {
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
      nama_rup: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      kode_rka: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      kode_periode: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      akun_bas_rka: {
        type: DataTypes.CHAR(6),
        allowNull: true,
      },
      akun_bas_realisasi: {
        type: DataTypes.CHAR(6),
        allowNull: true,
      },
      akun_bas_final: {
        type: DataTypes.CHAR(6),
        allowNull: true,
      },
      no_rekening_asal: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      kode_bank_asal: {
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      pemilik_rekening: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      no_rekening_tujuan:{
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      kode_bank_tujuan: {
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      nama_bank_tujuan: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      kode_kriteria: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      kode_jenis_pembayaran: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      nama_permintaan: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      metode_pembayaran: {
        type: DataTypes.CHAR(25),
        allowNull: true,
      },
      persen: {
        type: DataTypes.INTEGER(5),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
      },
      total_kontrak: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
      },
      status_pembayaran: {
        type: DataTypes.INTEGER(5),
        allowNull: true,
      },
      path_spp: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_sptb: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_rk: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_spk: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_BAST: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_copy_NPWP: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_e_faktur: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      path_copy_halaman_depan_rekening: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      kode_unit: {
        type: DataTypes.CHAR(25),
        allowNull: true,
      },
      nama_unit: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      kode_sub_unit: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      nomor_spm: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      tanggal_permintaan: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      kode_status: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue:3
      },
      data_pengusulan: {
        type: DataTypes.ENUM('TRANSAKSI-HISTORIS','TRANSAKSI-BARU'),
        allowNull: false,
        defaultValue:'TRANSAKSI-BARU'
      },
      ucr: {
        type: DataTypes.TEXT,
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
    tableName: "ref_surat_barjas",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SuratBarjas.belongsTo(dokumenKirimPanutan,{foreignKey:"kode_permintaan",targetKey:"id_surat_tugas"});



module.exports = SuratBarjas;
