const { Sequelize } = require("sequelize");
const db = require("../config/database");
const SuratTugasExpenditure = require("./ref_surat_expenditure");
const { DataTypes } = Sequelize;
 
const dokumenKirimPanutan = db.define(
  "dokumenKirimPanutan",
  {
    id_trx: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
    },
    katagori_surat: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    id_surat_tugas: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    kode_unit: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
    },
    jenis_surat: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },

    id_nomor: {
      type: DataTypes.CHAR(20),
      allowNull: true,
    },
    nomor: {
      type: DataTypes.CHAR(20),
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    link_file: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    id_file: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    aktif: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
  },
  {
    tableName: "trx_dokumen_kirim_ke_panutan",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

dokumenKirimPanutan.belongsTo(SuratTugasExpenditure, {
  foreignKey: "kode_surat_header",
  as: "dokHeader",
});

SuratTugasExpenditure.hasMany(dokumenKirimPanutan, {
  foreignKey: "kode_surat_header",
  as: "SuratdokHeader",
});

module.exports = dokumenKirimPanutan;
