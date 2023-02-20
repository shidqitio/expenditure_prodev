const db = require("../../config/database");
const { DataTypes } = require("sequelize");
const SuratPerintahTransferDana = require("./ref_surat_perintah_transfer_dana");
const SuratPerintahMembayar = require("./ref_surat_perintah_membayar");

const TrxSptdSPM = db.define(
  "TrxSptdSPM",
  {
    kode_sptd: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey : true
    },
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey : true
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
    tableName: "trx_sptd_spm",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

TrxSptdSPM.belongsTo(SuratPerintahTransferDana, { foreignKey: "kode_sptd", as:"trx_spm_to_sptd" });
TrxSptdSPM.belongsTo(SuratPerintahMembayar, {
  foreignKey: "kode_surat_header",
  as: "trx_sptd_to_spm",
});
SuratPerintahTransferDana.hasMany(TrxSptdSPM, { foreignKey: "kode_sptd", as:"sptd_to_trx_spm"});
SuratPerintahMembayar.hasMany(TrxSptdSPM, {
  foreignKey: "kode_surat_header",
  as: "spm_to_trx_sptd",
});


module.exports = TrxSptdSPM;
