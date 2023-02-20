const db = require("../../config/database");
const PetugasPerjadinBiaya = require("../../models/trx_petugas_perjadin_biaya");
const KehadiranPetugasPerjadin = require("../../models/trx_kehadiran_petugas_perjadin");
const { jsonFormat } = require("../../utils/jsonFormat");
const {Op} = require("sequelize")
const sequelize = require("sequelize")
const store = (req,res,next) =>{
    let kondisiCount = datakondisi(req.body)
    KehadiranPetugasPerjadin.count('kode_trx',{where:kondisiCount})
    .then((jmlData)=>{
        return db.transaction()
        .then((t)=>{
            let kehadiran = dataKehadiran(req.body,req.body)
            return KehadiranPetugasPerjadin.create(kehadiran,{transaction:t}).then((create)=>{
                if(jmlData > 0){
                    return PetugasPerjadinBiaya.update({status_sppd:1},{where:kondisiCount,transaction:t})
                    .then(()=>{
                        t.commit()
                        jsonFormat(res,'success','berhasil input data',create)
                    })                    
                }else{
                    t.commit()
                    jsonFormat(res,'success','berhasil input data',create)
                }
            }).catch((err)=>{
                t.rollback()
                next(err)
            })
        })
    }).catch((err)=>{
        next(err)
    })
}

const bulkStore = (req,res,next) =>{
    let kehadiran = req.body.kehadiran
    db.transaction().then((t)=>{
        arr_trx = kehadiran.map((a)=>a.kode_trx)
        return PetugasPerjadinBiaya.update({status_sppd:1}, {where:{kode_trx:{[Op.in]:arr_trx}},include:{
            model:KehadiranPetugasPerjadin,
            as:"kehadiran",
            on:{
                kode_surat:sequelize.where(sequelize.col("PetugasPerjadinBiaya.id_surat_tugas"),"=",sequelize.col("kehadiran.kode_surat")),
                nip:sequelize.where(sequelize.col("PetugasPerjadinBiaya.nip"),"=",sequelize.col("kehadiran.nip")),
                kode_kota_tujuan:sequelize.where(sequelize.col("PetugasPerjadinBiaya.kode_kota_tujuan"),"=",sequelize.col("kehadiran.kode_kota_tujuan")),
            },
            required:true
        },transaction:t}).then(()=>{
            let datahadir = kehadiran.map((a)=>{
                return dataKehadiran(req.body,a)
            })
            // datahadir = Promise.all(datahadir).then((a)=>a)
            console.log("data hadirrrrrrr",datahadir)
            return KehadiranPetugasPerjadin.bulkCreate(datahadir,{transaction:t})
            .then((kehadiranCreate)=>{
                t.commit()
                jsonFormat(res,"success","berhasil menginput kehadiran",kehadiranCreate)
            }).catch((err)=>{
                t.rollback()
                next(err)
            })
        }).catch((err)=>{
            t.rollback()
            next(err)
        })
    }).catch((err)=>{
        next(err)
    })
}

const dataKehadiran = (body,subBody) =>{
    return{
        kode_surat: subBody.kode_surat,
        nip: subBody.nip,
        kode_kota_tujuan: subBody.kode_kota_tujuan,
        detail: subBody.detail,
        device: body.device,
        tanggal: body.tanggal,
        location: body.location,
        ucr: body.ucr
    }
}

const datakondisi = (body) =>{
    return {
        kode_surat: body.kode_surat,
        nip: body.nip,
        kode_kota_tujuan: body.kode_kota_tujuan
    }
}

module.exports = {
    store,
    bulkStore
}