const { Sequelize } = require("sequelize");
const db = require("../config/database");

const dokumenKirimPanutan = require("./trx_dokumen_kirim_ke_panutan")


const { DataTypes } = Sequelize;

const refSuratTambahan = db.define(
  "refSuratTambahan",
  {
    kode_surat: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
    },
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_nomor_surat: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: true,
    },
    katagori: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: true,
    },
    nomor_surat: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    kode_rka: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_periode: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: true,
    },
    tanggal_surat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    perihal: {
      type: DataTypes.CHAR(6),
      allowNull: true,
    },

    kode_unit: {
      type: DataTypes.CHAR(20),
      allowNull: true,
    },
    penerima_orang_pertama: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_bank: {
      type: DataTypes.CHAR(5),
      allowNull: true,
    },
    no_rekening: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    jumlah_penerima: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    biaya_spp: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    ppn_persen: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pph_persen: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ppn: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    pph: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    biaya_akhir: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    path_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kode_status: {
      type: DataTypes.INTEGER(11),
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
    tableName: "ref_surat_tambahan",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

refSuratTambahan.hasMany(dokumenKirimPanutan, {
  foreignKey: "id_surat_tugas",
  targetKey: "kode_surat",
  as: "tambahan_dokumen",
});

dokumenKirimPanutan.belongsTo(refSuratTambahan, {
  foreignKey: "id_surat_tugas",
  targetKey: "kode_surat",
  as: "dokumen_tambahan",
});


module.exports = refSuratTambahan;
