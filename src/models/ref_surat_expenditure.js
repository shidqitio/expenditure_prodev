const db = require("../config/database")
const {DataTypes} = require('sequelize')


const refSuratExpenditure = db.define(
    'refSuratExpenditure', 
    {
        kode_surat_header : {
            type : DataTypes.INTEGER(11),
            allowNull : false, 
            primaryKey : true
        }, 
        jenis_surat : {
            type : DataTypes.STRING(255), 
            allowNull : true
        }, 
        kode_surat_relasi : {
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
        tableName : 'ref_surat_expenditure', 
        createdAt: "udcr",
        updatedAt: "udch",
    }
)

module.exports = refSuratExpenditure