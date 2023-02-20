const db = require("../../config/database")
const {DataTypes} = require("sequelize")
const RefDaftarPengadaan = require("./ref_daftar_pengadaan")

const RefDetailPengadaan = db.define(
    "RefDetailPengadaan", 
    {
        id_uang_persediaan : {
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        kode_detail_pengadaan : {
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true
        },
        deskripsi : {
            type : DataTypes.STRING(50),
            allowNull : true
        },
        harga_satuan : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        satuan_ukuran : {
            type : DataTypes.STRING(255),
            allowNull : true
        }, 
        harga_satuan : {
            type : DataTypes.DECIMAL(16,2), 
            allowNull : true
        },
        total_harga : {
            type : DataTypes.DECIMAL(16,2), 
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
        tableName : 'ref_detail_pengadaan', 
        createdAt : 'udcr',
        updatedAt : 'udch'
    }
)

RefDaftarPengadaan.hasMany(RefDetailPengadaan, {
    foreignKey : 'id_uang_persediaan',
    as : 'RefDetailPengadaan'
})

RefDetailPengadaan.belongsTo(RefDaftarPengadaan, {
    foreignKey : 'id_uang_persediaan', 
    as : 'RefDaftarPengadaan'
})

module.exports = RefDetailPengadaan