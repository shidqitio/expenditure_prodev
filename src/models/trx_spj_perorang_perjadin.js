const { Sequelize } = require('sequelize');
const db = require('../config/database');

const { DataTypes } = Sequelize;
 
const spjPerorang = db.define('spjPerorangPerjadin',{
    kode_trx:{
        type:DataTypes.INTEGER(11),
        autoIncrement:true,
        allowNull:true
    },
    kode_unit: {
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    kode_surat : {
        type: DataTypes.CHAR(100),
        primaryKey: true,
        allowNull: true
    },
    nip: {
        type: DataTypes.CHAR(20),
        primaryKey: true,
        allowNull: true
    },
    kode_kota_tujuan: {
        type: DataTypes.CHAR(14),
        primaryKey: true,
        allowNull: true
    },
    nomor_surat_tugas: {
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    tanggal_surat: {
        type: DataTypes.DATE,
        allowNull: true
    },
    kota_tujuan: {
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    kode_rka: {
        type: DataTypes.CHAR(5),
        primaryKey: true,
        allowNull: true,
      },
      bulan_rka: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: true,
      },
    nomor_virtual_account: {
        type: DataTypes.CHAR(100),
        allowNull: true
    },
    kode_nomor_spm: {
        type: DataTypes.CHAR(50),
        allowNull: true
    },
    status: {
        type: DataTypes.CHAR(3),
        allowNull: true
    },
    nominal: {
        type: DataTypes.BIGINT(25),
        allowNull: true
    },
    keterangan: {
        type: DataTypes.CHAR(50),
        allowNull: true
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
}, {
        tableName: 'trx_spj_perorang_perjadin',
        createdAt: 'udcr',
        updatedAt: 'udch',
    }
)

module.exports = spjPerorang;