const HonorPanitiaKegiatan = require("../../models/trx_petugas_honorarium/trx_petugas_honor_panitia_kegiatan");
const db = require("../../config/database");
const HonorPengisiKegiatan = require("../../models/trx_petugas_honorarium/trx_petugas_honor_pangisi_kegiatan");
const HonorPenulisSoal = require("../../models/trx_petugas_honorarium/trx_petugas_honor_penulis_soal");
const HonorTutor = require("../../models/trx_petugas_honorarium/trx_petugas_honor_tutor");
const petugasHonorarium = require("../../models/trx_petugas_honorarium/trx_petugas_honorarium_all");
const datarefHonor = require("./ref_honorarium_kegiatan_data");
const sbmPanitia = require("../ref/ref_sbm_honorarium_panitia_kegiatan")
const sbmPengisi = require("../ref/ref_sbm_honorarium_pengisi_kegiatan")
const sbmHonorarium = require("../ref/ref_sbm_honorarium_all")
const sbmTutor = require("../ref/ref_sbm_honor_tutor");

const refPajak = require("../ref/ref_pajak_honorarium")
const Surat = require("./ref_honorarium_kegiatan");
const { jsonFormat } = require("../../utils/jsonFormat");

const insertPanitiaKegiatan = async(req,res,next) =>{
    try{
        let dataPetugas = req.body.dataPanitia
        let kode_trx_surat =  await Surat.getKodeTrx(`${req.body.kode_surat}-honorarium`,req.body.tahun)
        let dataInsert =  dataPetugas.map(async(a)=>{
             
           let sbm =  await sbmPanitia.showunik(a.tugas,a.gol)
           let pajak =  await refPajak.showunik(a.gol,a.status_npwp)
           console.log(sbm,"-",pajak);
            let ab = await datarefHonor.dataPetugasHonor(req.body,a,sbm,pajak,kode_trx_surat)
            return ab
            
        })
        dataInsert = await Promise.all(dataInsert)
        console.log("z",dataInsert);
       let response = await db.transaction()
        .then((t)=>{
            return HonorPanitiaKegiatan.destroy({where:{kode_trx_surat:kode_trx_surat},transaction:t})
            .then(()=>{
                return HonorPanitiaKegiatan.bulkCreate(dataInsert,{transaction:t})
                .then((a)=>{
                    t.commit()
                    return jsonFormat(res,"success","berhasil menginput data",a)
                })
                .catch((err)=>{
                    throw err
                })
            }) 
            .catch((err)=>{
                t.rollback()
                throw err
            })
        }).catch((err)=>{
        throw err
        })
    }catch(err){
    next(err)
    }
}

const insertPengisiKegiatan = async(req,res,next) =>{
    try{
        let dataPengisi = req.body.dataPengisi
        console.log(dataPengisi);
        let kode_trx_surat =  await Surat.getKodeTrx(`${req.body.kode_surat}-honorarium`,req.body.tahun)
        let dataInsert =  dataPengisi.map(async(a)=>{
            let sbm =  await sbmPengisi.showunik(a.tugas,a.jabatan,a.eselon).then((a)=> {if(a== null){throw new Error('ada data yang tidak sesuai sbm silahkan cek tugas,jabatan dan/atau eselon'+a.nip+'-'+a.nama)} return a})
            let pajak =  await refPajak.showunik(a.gol,a.status_npwp).then((a)=> {if(a== null){throw new Error('ada data yang tidak sesuai pajak silahkan cek gol dan/atau status_npwp'+a.nip+'-'+a.nama)} return a})
             let ab = await datarefHonor.dataHonorPengisiKegiatan(req.body,a,sbm,pajak,kode_trx_surat)
             return ab
             
         })
         dataInsert = await Promise.all(dataInsert)
         console.log("data insert",dataInsert)
         let response = await db.transaction()
        .then((t)=>{
            return HonorPengisiKegiatan.destroy({where:{kode_trx_surat:kode_trx_surat},transaction:t})
            .then(()=>{
                return HonorPengisiKegiatan.bulkCreate(dataInsert,{transaction:t})
                .then((a)=>{
                    t.commit()
                    return jsonFormat(res,"success","berhasil menginput data",a)
                })
                .catch((err)=>{
                    throw err
                })
            }) 
            .catch((err)=>{
                t.rollback()
                throw err
            })
        }).catch((err)=>{
        throw err
        })
    }catch(err){
        next(err)
    }
}

const insertTutor = async(req,res,next) =>{
    try{
        let dataTutorBody = req.body.dataTutor
        let kode_trx_surat =  await Surat.getKodeTrx(`${req.body.kode_surat}-honorarium`,req.body.tahun)
        let dataInsert =  dataTutorBody.map(async(a)=>{
            let sbm =  await sbmTutor.showunik(a.jenjang_ngajar).then((a)=> {if(a== null){throw new Error('ada data yang tidak sesuai sbm silahkan cek jenjang ngajar'+a.nip+'-'+a.nama)} return a})
            let pajak =  await refPajak.showunik(a.gol,a.status_npwp).then((a)=> {if(a== null){throw new Error('ada data yang tidak sesuai pajak silahkan cek gol dan/atau status_npwp'+a.nip+'-'+a.nama)} return a})
             let ab = await datarefHonor.dataHonorTutor(req.body,a,sbm,pajak,kode_trx_surat)
             return ab
         })
         dataInsert = await Promise.all(dataInsert)
         console.log("data insert",dataInsert)
         let response = await db.transaction()
        .then((t)=>{
            return HonorPengisiKegiatan.destroy({where:{kode_trx_surat:kode_trx_surat},transaction:t})
            .then(()=>{
                return HonorPengisiKegiatan.bulkCreate(dataInsert,{transaction:t})
                .then((a)=>{
                    t.commit()
                    return jsonFormat(res,"success","berhasil menginput data",a)
                })
                .catch((err)=>{
                    throw err
                })
            }) 
            .catch((err)=>{
                t.rollback()
                throw err
            })
        }).catch((err)=>{
        throw err
        })
    }catch(err){
        next(err)
    }
}

const insertPetugasHonor = async(req,res,next)=>{
    try{
        let dataPetugas = req.body.dataPetugas
        let kode_trx_surat =  await Surat.getKodeTrx(`${req.body.kode_surat}-honorarium`,req.body.tahun)
        console.log(kode_trx_surat);
        if(!!kode_trx_surat === false){
            throw new Error('kode surat tidak cocok')
        }
        console.log(dataPetugas)
                const arrPendidikan = [
                  "NA",
                  "SD",
                  "SLTP",
                  "SLTA",
                  "D-I",
                  "D-II",
                  "D-III",
                ];
        let dataInsert =  dataPetugas.map(async(a)=>{
            let sbm =  await sbmHonorarium.showunik(req.body,a).then((b)=> {if(b== null){throw new Error(`ada data yang tidak sesuai sbm silahkan cek data yang diinputkan nama: ${a.nama} / nip : ${a.nip}`)} return b})
          let golonganpajak = a.gol;
          if (!!a?.pendidikan == false) {
          } else {
            if (arrPendidikan.includes(a.pendidikan) === true) {
              golonganpajak = "D3/Dibawahnya";
            }
          }
            let pajak = await refPajak
              .showunik(golonganpajak, a.status_npwp)
              .then((b) => {
                if (b == null) {
                  throw new Error(
                    "ada data yang tidak sesuai pajak silahkan cek gol dan/atau status_npwp"
                  );
                }
                return b;
              });
            let ab = await datarefHonor.dataPetugasHonorarium(req.body,a,sbm,pajak,kode_trx_surat)
             return ab
        })
        dataInsert = await Promise.all(dataInsert)
        console.log('data Insert',dataInsert)
        let response = await db.transaction()
        .then((t)=>{
            return petugasHonorarium.destroy({where:{kode_trx_surat:kode_trx_surat},transaction:t})
            .then(()=>{
                return petugasHonorarium.bulkCreate(dataInsert,{transaction:t})
                .then((a)=>{
                    t.commit()
                    return jsonFormat(res,"success","berhasil menginput data",a)
                })
                .catch((err)=>{
                    throw err
                })
            }) 
            .catch((err)=>{
                t.rollback()
                throw err
            })
        }).catch((err)=>{
        throw err
        })
    }catch(err){
        next(err)
    }
}

const updateNominalPetugasHonor = (req,res,next) =>{
    petugasHonorarium.findOne({where:{kode_trx:req.params.kode_trx}})
    .then((honor)=>{
        if(honor == null){
            let err = new Error('data petugas honorarium tidak ada dalam database')
            err.statusCode = 422
            throw err
        }
        return sbmHonorarium.showtrx(honor.kode_trx_sbm).then((sbm)=>{
            let batas_satuan_biaya = sbm.satuan_biaya 
            if(req.body.satuan_biaya > batas_satuan_biaya){
                let err = new Error('jumlah diterima tidak bisa melebihi batas sbm')
                err.statusCode = 421
                throw err
            }
            return refPajak.showtrx(honor.kode_trx_pajak).then((pajak) =>{
                let data_update = datarefHonor.data_update_nominal_petugas(pajak,req.body.satuan_biaya,honor)
                return petugasHonorarium.update(data_update,{where:{kode_trx:req.params.kode_trx}}).then((upd)=>{
                    jsonFormat(res,"success","Berhasil merubah data",upd)
                })
            })
        })
        
    })
    .catch((err)=>{
        err.statusCode = 401
        next(err)
    })
}

module.exports ={
    insertPanitiaKegiatan,
    insertPengisiKegiatan,
    insertTutor,
    insertPetugasHonor,
    updateNominalPetugasHonor
}
