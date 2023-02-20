const { Sequelize } = require("sequelize");
const db = require("../../config/database");

const { DataTypes } = Sequelize;

const ref_surat_expenditure = db.define(
  "ref_surat_expenditure",
  {
    kode_surat_header: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    jenis_surat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    kode_surat_relasi: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: "ref_surat_expenditure",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_surat_expenditure;
