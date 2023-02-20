const db = require("../../config/database")
const {DataTypes} = require("sequelize")
const RefUsulanGup = require("./ref_usulan_gup")

const RefDaftarPengadaan = db.define(
    "RefDaftarPengadaan", 
    {
        kode_surat : {
            type : DataTypes.INTEGER(),
            allowNull : false
        },
        id_uang_persediaan : {
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true
        },
        nama_permintaan_up : {
            type : DataTypes.STRING(255), 
            allowNull : true
        }, 
        nama_penyedia : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        jenis : {
            type : DataTypes.STRING(50), 
            allowNull : true
        }, 
        kriteria : {
            type : DataTypes.STRING(50), 
            allowNull : true
        }, 
        tanggal : {
            type : DataTypes.DATE(), 
            allowNull : true
        },
        total : {
            type : DataTypes.DECIMAL(16,2), 
            allowNull : true
        },
        keterangan : {
            type : DataTypes.STRING(255), 
            allowNull : true
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
        tableName : 'ref_daftar_pengadaan',    
        createdAt : "udcr", 
        updatedAt : "udch"
    }
)

RefUsulanGup.hasMany(RefDaftarPengadaan, {
    foreignKey : "kode_trx", 
    as : 'RefDaftarPengadaan'
})

RefDaftarPengadaan.belongsTo(RefUsulanGup, {
    foreignKey : "kode_trx", 
    as : "RefUsulanGup"
})

module.exports = RefDaftarPengadaan