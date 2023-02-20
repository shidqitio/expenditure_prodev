const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const SuratExpenditure = require("../ref_surat_expenditure")

const { DataTypes } = Sequelize;

const ref_surat_tugas_perjadin_awal = db.define(
  "ref_surat_tugas_perjadin_awal",
  {
    kode_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nomor_surat_tugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sifat_surat: {
      type: DataTypes.ENUM("RAHASIA", "TERBATAS", "BIASA"),
      allowNull: false,
    },
    jenis_perjalanan: {
      type: DataTypes.ENUM("PERJALANAN_DINAS", "DALAM_KOTA", "LUAR_NEGERI"),
      allowNull: false,
    },
    klasifikasi_surat: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    kode_unit_pagu: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    keperluan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tanggal_surat_tugas: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nip_penandatangan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_penandatangan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    link_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    data_pengusulan: {
      type: DataTypes.ENUM("TRANSAKSI_HISTORIS", "TRANSAKSI_BARU"),
      allowNull: true,
      defaultValue: "DRAF",
    },
    rincian_kegiatan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "DRAF",
        "PROSES",
        "REVISI",
        "PENGAJUAN",
        "BATAL",
        "SELESAI"
      ),
      allowNull: false,
    },
    ucr: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    uch: {
      type: DataTypes.STRING(255),
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
    tableName: "ref_surat_tugas_perjadin_awal",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

SuratExpenditure.hasMany(ref_surat_tugas_perjadin_awal, {
  foreignKey: "kode_surat_header",
  as: "SuratTugasPerjadin",
});

ref_surat_tugas_perjadin_awal.belongsTo(SuratExpenditure, {
  foreignKey: "kode_surat_header",
  as: "SuratExpenditure",
});

module.exports = ref_surat_tugas_perjadin_awal;
