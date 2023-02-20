const db = require("../config/database")
const {DataTypes} = require("sequelize")

const Authorize = db.define(
    "Authorize", 
    {
        id_authorize : {
            type : DataTypes.INTEGER(11), 
            autoIncrement : true,
            allowNull : false, 
            primaryKey : true
        },
        id_user : {
            type : DataTypes.INTEGER(11), 
            primaryKey : true, 
            allowNull : false
        }, 
        kode_group : {
            type : DataTypes.STRING(10),
            allowNull : true
        }, 
        token : {
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
        tableName : "authorize",
        createdAt : 'udcr', 
        updatedAt : 'udch'
    }
)

module.exports = Authorize