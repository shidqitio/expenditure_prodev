const { Sequelize } = require("sequelize");
const db = require("../../config/database");
const SuratExpenditure = require("./ref_surat_expenditure")

const { DataTypes } = Sequelize;

const trx_pemaraf_surat_perjadin = db.define(
  "trx_pemaraf_surat_perjadin",
  {
    kode_pemaraf: {
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
    status: {
      type: DataTypes.ENUM("BELUM PARAF", "SUDAH PARAF"),
      allowNull: false,
    },
  },
  {
    tableName: "trx_pemaraf_surat_perjadin",
    timestamps: false,
  }
);

SuratExpenditure.hasMany(trx_pemaraf_surat_perjadin, {
  foreignKey: "kode_surat_header",
  as: "Pemaraf",
});

trx_pemaraf_surat_perjadin.belongsTo(SuratExpenditure, {
  foreignKey: "kode_surat_header",
  as: "SuratExpenditure",
});

module.exports = trx_pemaraf_surat_perjadin;
