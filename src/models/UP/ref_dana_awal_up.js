const db = require("../../config/database")
const {DataTypes} = require("sequelize")

const DanaAwalUP = db.define(
    "DanaAwalUP", 
    {
        kode_unit : {
            type : DataTypes.STRING(16), 
            allowNull : false, 
            primaryKey : true
        }, 
        nama_unit : {
            type : DataTypes.STRING(255),
            allowNull : true
        }, 
        dana_awal_up : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true
        },
        dana_sisa_up : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true
        },
        dana_tersedia : {
            type : DataTypes.DECIMAL(20,2),
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
        tableName : 'ref_dana_awal_up',
        createdAt: "udcr",
        updatedAt: "udch",
    }
)

module.exports = DanaAwalUP