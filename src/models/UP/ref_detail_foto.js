const db = require("../../config/database")
const RefDaftarPengadaan = require("./ref_daftar_pengadaan")
const {DataTypes} = require("sequelize")

const RefDetailFoto = db.define(
    "RefDetailFoto", 
    {
        id_uang_persediaan : {
            type : DataTypes.INTEGER(),
            allowNull : true
        }, 
        kode_bukti : {
            type : DataTypes.INTEGER(),
            allowNull : false, 
            primaryKey : true, 
            autoIncrement : true
        },
        nama : {
            type : DataTypes.STRING(255), 
            allowNull : true
        }, 
        bukti : {
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
        tableName : 'ref_detail_foto', 
        createdAt : 'udcr', 
        updatedAt : 'udch'
    }
)

RefDaftarPengadaan.hasMany(RefDetailFoto, {
    foreignKey : 'id_uang_persediaan',
    as : 'RefDetailFoto'
})

RefDetailFoto.belongsTo(RefDaftarPengadaan, {
    foreignKey : 'id_uang_persediaan', 
    as : 'RefDaftarPengadaan'
})

module.exports = RefDetailFoto