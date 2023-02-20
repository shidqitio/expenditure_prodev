const PetugasPerjadinBiaya = require("../../models/trx_petugas_perjadin_biaya");
const SuratTugasPerjadin = require("../../models/ref_surat_tugas_perjadin");
const KehadiranPetugasPerjadin = require("../../models/trx_kehadiran_petugas_perjadin");
const { jsonFormat } = require("../../utils/jsonFormat");
const {Op} = require("sequelize")
const sequelize = require("sequelize")
const listtamu = (req,res,next) =>{
    PetugasPerjadinBiaya.findAll({
        where:{kode_unit_tujuan:req.params.kode_unit_tujuan,status_pengusulan:{[Op.in]:[0,1,2]}},include:[{
        model:SuratTugasPerjadin,
        as:"surat"
    },{
        model:KehadiranPetugasPerjadin,
        as:"kehadiran",
        on:{
            kode_surat:sequelize.where(sequelize.col("PetugasPerjadinBiaya.id_surat_tugas"),"=",sequelize.col("kehadiran.kode_surat")),
            nip:sequelize.where(sequelize.col("PetugasPerjadinBiaya.nip"),"=",sequelize.col("kehadiran.nip")),
            kode_kota_tujuan:sequelize.where(sequelize.col("PetugasPerjadinBiaya.kode_kota_tujuan"),"=",sequelize.col("kehadiran.kode_kota_tujuan")),
        },
        required:false
    }
]}).then((data)=>{
        jsonFormat(res,"success","berhasil menampilkan",data)
    }).catch((err)=>{next(err)})
}

const show = (req,res,next) =>{
    PetugasPerjadinBiaya.findAll({where:req.params,include:[{
        model:SuratTugasPerjadin,
        as:"surat"
    },
    {
        model:KehadiranPetugasPerjadin,
        as:"kehadiran",
        on:{
            kode_surat:sequelize.where(sequelize.col("PetugasPerjadinBiaya.id_surat_tugas"),"=",sequelize.col("kehadiran.kode_surat")),
            nip:sequelize.where(sequelize.col("PetugasPerjadinBiaya.nip"),"=",sequelize.col("kehadiran.nip")),
            kode_kota_tujuan:sequelize.where(sequelize.col("PetugasPerjadinBiaya.kode_kota_tujuan"),"=",sequelize.col("kehadiran.kode_kota_tujuan")),
        },
        require:false
    }
]}).then((data)=>{
        if(data.length < 2){
            data = data[0]
        }
        jsonFormat(res,"success","berhasil menampilkan",data)
    }).catch((err)=>{next(err)})
}
module.exports ={
    listtamu,
    show
}