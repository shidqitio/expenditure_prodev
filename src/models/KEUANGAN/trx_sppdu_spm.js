const db = require("../../config/database");
const { DataTypes } = require("sequelize");
const SuratPencairanDanaUnit = require("./ref_surat_pencairan_dana_unit");
const SuratPerintahMembayar = require("./ref_surat_perintah_membayar");

const TrxSppduSPM = db.define(
  "TrxSppduSPM",
  {
    kode_trx: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_sppdu: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    aktif: {
      type: DataTypes.ENUM("AKTIF", "NON_AKTIF"),
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
    tableName: "trx_sppdu_spm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

TrxSppduSPM.belongsTo(SuratPencairanDanaUnit, {
  foreignKey: "kode_sppdu",
  as: "trx_spm_to_sppdu",
});
TrxSppduSPM.belongsTo(SuratPerintahMembayar, {
  foreignKey: "kode_surat_header",
  as: "trx_sppdu_to_spm",
});
SuratPencairanDanaUnit.hasMany(TrxSppduSPM, {
  foreignKey: "kode_sppdu",
  as: "sppdu_to_trx_spm",
});
SuratPerintahMembayar.hasMany(TrxSppduSPM, {
  foreignKey: "kode_surat_header",
  as: "spm_to_trx_sppdu",
});

module.exports = TrxSppduSPM;
