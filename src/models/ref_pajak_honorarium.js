const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const ref_pajak_honorarium = db.define(
  "pajak_honorarium",
  {
    golongan: {
      type: DataTypes.STRING(5),
      allowNull: true,
      primaryKey: true,
    },
    status_npwp: {
      type: DataTypes.ENUM('WITH-NPWP','WITHOUT-NPWP'),
      allowNull: true,
    },
    besaran_pajak: {
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
    tableName: "ref_pajak_honorarium",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

module.exports = ref_pajak_honorarium;
