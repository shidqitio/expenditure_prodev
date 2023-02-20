
const refSPM = require("../../models/ref_spm")
const refSuratTugasPerjadin = require("../../models/ref_surat_tugas_perjadin")
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan")
const sequelize = require("sequelize")
const {Op,where,fn,col} = require("sequelize")
const db = require("../../config/database")
const idAPI = require("../../lang/id-api.json")
const axios = require("axios")
const { jsonFormat } = require("../../utils/jsonFormat")
const { body } = require("express-validator")
const hostPevita = process.env.hostPevita
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostsiakun = process.env.hostSiakun
const hostSiakunBe1 = process.env.hostSiakunBe1
const aplikasi = process.env.aplikasi
const generate = require("../../utils/generate");

exports.createSPMPerjadin = (req,res,next) =>{
        dokumenKirimPanutan.max('id_trx').then((maxDok)=>{
            console.log(maxDok)
             return getNomor(req.body,maxDok+1).then((resNomor)=>{
                console.log(resNomor)
                let dataDok = datadokumen(req.body,resNomor.id_nomor,resNomor.nomor,1,maxDok+1)
                console.log(dataDok);
                return db.transaction().then((t)=>{
                    return dokumenKirimPanutan.create(dataDok,{transaction:t}).then((resDok)=>{
                        let dtSPM = dataSPM(req.body.ucr,resNomor.id_nomor,resNomor.nomor,maxDok+1)
                        return refSPM.create(dtSPM,{transaction:t}).then((resSPM)=>{
                            return refSuratTugasPerjadin.update({kode_status:5,nomor_spm:resDok.nomor},{where:[where(
                                fn('CONCAT',col('id_surat_tugas'), '|', col('tahun')), 
                                { [Op.in]:req.body.dataSurat } )],transaction:t}).then((resSurat)=>{
                                    t.commit()
                                    return jsonFormat(res,'success','berhasil membuat nomor',resSPM)
                                })
                        })
                        
                    }).catch((erro)=>{
                        t.rollback()
                        next(erro)
                    })
                })
             })
        }).catch((err)=>{
            next(err)
        })
}



let token = async()=>{
    return await axios .post(`${hostPevita}${idAPI.pevita.login}`)
    .then((a)=>{return a.data.access_token})
  }

const getNomor = (body,newTrx) =>{
    return token().then((access_token)=>{
        console.log(access_token);
        let dataNomor = datagetnomor(body,newTrx)
        console.log(dataNomor);
            return axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,dataNomor,
          { headers: { Authorization: `Bearer ${access_token}` }}).then((response)=>{
            return response.data
          })
        
    }).catch((err)=>{return []})  
}

const datagetnomor = (body,newTrx)=>{
    return{
        "aplikasi":aplikasi,
        "sifat_surat":body.sifat_surat,
        "id_surat":newTrx,
        "id_jenis_surat":body.id_jenis_surat,
        "id_jenis_nd":body.id_jenis_nd,
        "perihal":body.perihal,
        "id_klasifikasi":body.id_klasifikasi,
        "id_sub_unit":body.id_sub_unit,
        "id_user":body.id_user,        
        "nama_pembuat":body.ucr,
        "tanggal":body.tanggal
    }
}

const dataSPM = (ucr,id_nomor,nomor,newTrx)=>{
return{
    kode_nomor_spm:id_nomor,
    nomor_spm:nomor,
    kode_trx_panutan:newTrx,
    ucr:ucr
}
}



const datadokumen = (body,id_nomor,nomor,aktif,newTrx) =>{
    return {
        id_trx:newTrx,
        katagori_surat:body.katagori_surat,
        id_surat_tugas:body.id_surat_tugas,
        kode_unit:body.kode_unit,
        tahun:body.tahun,
        tanggal:body.tanggal,
        jenis_surat:body.type_surat,
        id_nomor:id_nomor,
        nomor:nomor,
        aktif:aktif
    }
    }



