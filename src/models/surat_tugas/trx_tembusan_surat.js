const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const SuratExpenditure = require("./ref_surat_expenditure");

const { DataTypes } = Sequelize;

const trx_tembusan_surat = db.define(
  "trx_tembusan_surat",
  {
    kode_trx: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_petugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    aktif: {
      type: DataTypes.ENUM("AKTIF", "NON_AKTIF"),
      allowNull: false,
    },
  },
  {
    tableName: "trx_tembusan_surat",
    timestamps: false,
  }
);

SuratExpenditure.hasMany(trx_tembusan_surat, {
  foreignKey: "kode_surat_header",
  as: "Tembusan",
});

trx_tembusan_surat.belongsTo(SuratExpenditure, {
  foreignKey: "kode_surat_header",
  as: "SuratExpenditure",
});

module.exports = trx_tembusan_surat;
