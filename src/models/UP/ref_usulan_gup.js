const {DataTypes} = require("sequelize")
const db = require("../../config/database")
const dokumenKirimPanutan = require("../trx_dokumen_kirim_ke_panutan")
const RefUsulanGup = db.define(
    "RefUsulanGup", 
    {
        kode_surat : {
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true
        },
        kode_surat_header : {
            type : DataTypes.INTEGER(11),
            allowNull : true
        },
        id_surat_tugas : {
            type : DataTypes.STRING(50),
            allowNull : false,
        },
        deskripsi_usulan : {
            type : DataTypes.STRING(150),
            allowNull : true, 
        },
        tanggal_usulan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        jenis_belanja : {
            type : DataTypes.STRING(50),
            allowNull : true
        },
        katagori : {
            type : DataTypes.STRING(50),
            allowNull : true
        },
        kode_unit : {
                type : DataTypes.STRING(16),
                allowNull : true
        },
        nomor_surat : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        kode_kegiatan_ut_detail: {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nama_kegiatan_ut_detail : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        kode_aktivitas_rkatu : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nama_aktivitas_rkatu : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        kode_rka : {
            type : DataTypes.STRING(5),
            allowNull : true
        },
        kode_periode : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        tanggal_surat : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        perihal : {
            type : DataTypes.STRING(50),
            allowNull : true
        },
        total_biaya : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true
        },
        tahun : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        status_posisi : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        komentar : {
            type : DataTypes.TEXT(),
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
        tableName : 'ref_usulan_gup',
        createdAt : "udcr",
        updatedAt : "udch"
     }
)

RefUsulanGup.hasMany(dokumenKirimPanutan, {
    foreignKey : 'id_surat_tugas',
    as : 'DokumenPanutan'
})

dokumenKirimPanutan.belongsTo(RefUsulanGup, {
    foreignKey : 'id_surat_tugas',
    as : 'UsulanGup'
})

module.exports = RefUsulanGup