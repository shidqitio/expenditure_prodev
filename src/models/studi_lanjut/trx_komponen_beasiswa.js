const db = require("../../config/database");
const {DataTypes} = require("sequelize");
const TrxSuratTugasBeasiswa = require("./trx_surat_tugas_beasiswa")
const RefStudiLanjut = require("./ref_studi_lanjut")

const TrxKomponenBeasiswa = db.define(
    "TrxKomponenBeasiswa", 
    {
        kode_trx : {
            type : DataTypes.INTEGER(11), 
            allowNull : false
        },
        kode_trx_komponen_beasiswa : {
            type : DataTypes.INTEGER(11), 
            allowNull : false, 
            primaryKey : true
        },
        nip : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        nama_pegawai : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        keterangan : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        golongan : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        biaya_pendaftaran : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        biaya_spp : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        dana_hidup : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        tunjangan_buku : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        tunjangan_keluarga : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        dana_transportasi : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        dana_kedatangan : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        dana_keadaan_darurat : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        bantuan_penelitian : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        bantuan_seminar : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        bantuan_publikasi : {
            type : DataTypes.DECIMAL(16,2),
            allowNull : true
        },
        pph : {
            type : DataTypes.INTEGER(11),
            allowNull : true
        },
        jumlah_diterima : {
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
        tableName : "trx_komponen_beasiswa", 
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxSuratTugasBeasiswa.hasMany(TrxKomponenBeasiswa, {
    foreignKey : 'kode_trx', 
    as : 'TrxKomponenBeasiswa'
})

TrxKomponenBeasiswa.belongsTo(TrxSuratTugasBeasiswa, {
    foreignKey : 'kode_trx',
    as : 'TrxSuratTugasBeasiswa'
})


module.exports = TrxKomponenBeasiswa;