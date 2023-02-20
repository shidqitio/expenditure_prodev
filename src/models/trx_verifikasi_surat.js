const { Sequelize } = require("sequelize");
const db = require("../config/database");
const SuratTugasPerjadin = require("./ref_surat_tugas_perjadin");

const { DataTypes } = Sequelize;

const verifikasiSurat = db.define(
  "verifikasi_surat",
  {
    id_surat_tugas: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      primaryKey: true,
    },
    nip:{
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    katagori:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    waktu_verifikasi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    udcr: {
        type: DataTypes.DATE,
        allowNull: true,
      },


  },
  {
    tableName: "trx_verifikasi_surat",
    createdAt: "udcr",
    updatedAt: false,
  }
);


verifikasiSurat.hasMany(SuratTugasPerjadin, { foreignKey: "id_surat_tugas", as: "suratperjadinmany" });
//verifikasiSurat.belongsTo(SuratTugasPerjadin,{foreignKey:"id_surat_tugas", as:"suratperjadin"});

module.exports = verifikasiSurat;
