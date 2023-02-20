const { Sequelize } = require("sequelize");
const db = require("../config/database");


const { DataTypes } = Sequelize;

const detailTransfer = db.define(
  "refDetailTransfer",
  {
    nip: {
        type: DataTypes.CHAR(50),
        allowNull: true,
        primaryKey: true,
      },
     kode_surat: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    kode_sub_surat: {
      type: DataTypes.CHAR(100),
      allowNull: true,
    },
    unit_bank: {
    type: DataTypes.STRING(215),
    allowNull: true,
    },
    waktu_transfer: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    nama_penentrasfer: {
        type: DataTypes.STRING(100),
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
    tableName: "ref_detail_transfer",
    createdAt: "udcr",
    updatedAt: "udch",
  }
);

//detailTransfer.belongsTo(transferExpenditure,{targetKey: 'id',foreignKey:"kode_trx_tf", as:"permintaantransfer"});


module.exports = detailTransfer;
