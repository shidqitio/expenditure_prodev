const { Sequelize } = require("sequelize");
const db = require("../config/database");
const detailTransfer = require("./ref_detail_transfer");

const { DataTypes } = Sequelize;

const transferExpenditure = db.define(
  "Transferexpenditure",
  {

      nip:{
        type: DataTypes.CHAR(50),
        allowNull: true,
        primaryKey:true,
      },
      nama:{
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      kode_surat:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey:true,
      },
      kode_sub_surat:{
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey:true,
      },
      nomor_rekening:{
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
      kode_bank:{
        type: DataTypes.CHAR(20),
        allowNull: true,
      },
      nama_bank:{
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
      nominal:{ 
        type: DataTypes.BIGINT(25),
        allowNull: true,
      },
      perihal:{
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status:{
        type: DataTypes.INTEGER(1),
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
    tableName: "trx_transfer_expenditure",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

//transferExpenditure.belongsTo(detailTransfer);
//verifikasiSurat.hasMany(SuratTugasPerjadin, { foreignKey: "id_surat_tugas", as: "suratperjadinmany" });
//verifikasiSurat.belongsTo(SuratTugasPerjadin,{foreignKey:"id_surat_tugas", as:"suratperjadin"});

module.exports = transferExpenditure;
