const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const axiosRetry = require("axios-retry")
const { QueryTypes,Op } = require("sequelize");
const transferExpenditure = require("../models/trx_transfer_expenditure")
const waitingTransfer = require("../models/trx_waiting_list_transfer")
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");
const detailTransfer = require("../models/ref_detail_transfer");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const refSPTD = require("../models/ref_sptd")
const { response } = require("express");
const hostProdevPanutan = process.env.hostProdevPanutan 
const hostSiakunBe1 = process.env.hostSiakunBe1
const hostutpay = process.env.hostutpay
const idAPI = require("../lang/id-api.json")
const { getSignature } = require("../middleware/headersUtBank");
const log4js = require("log4js");



exports.transferExpenditureController = async (req,res,next) =>{
    try{
    let transfer = req.body.transfer;
    let jumlahdataarray = transfer.length
    let arrDataTransfer = [];
    let Jurnal = []
    let hitung_ada_data = 0;
    for(let a = 0; a<jumlahdataarray;a++){
                let nip = transfer[a].nip
                let nama = transfer[a].nama
                let nomor_rekening = transfer[a].nomor_rekening
                let kode_bank = transfer[a].kode_bank
                let nama_bank = transfer[a].nama_bank
                let nominal=transfer[a].nominal
                let kode_surat=transfer[a].kode_surat
                let kode_sub_surat=transfer[a].kode_sub_surat
                let perihal=transfer[a].perihal
                let ucr=transfer[a].ucr

        arrDataTransfer.push({
            nip:nip,
            nama:nama,
            nomor_rekening:nomor_rekening,
            kode_bank: kode_bank,
            nama_bank:nama_bank,
            nominal:nominal,
            kode_surat: kode_surat,
            kode_sub_surat: kode_sub_surat,
            perihal:perihal,
            status:0,
            ucr:ucr
    }) 

    Jurnal.push({
        tanggal_transaksi:'2022-10-06',
        keterangan:perihal,
        modul:'Perjalanan-Dinas',
        aplikasi:'E-Expenditure',
        kode_surat:kode_surat,
        jurnal_aktiva:'Pengeluaran Perjalanan Dinas',
        jurnal_pasiva:'Kas',
        akun_aktiva:525115,
        akun_pasiva:111111,
        Aktiva:nominal,
        Pasiva:nominal,
        ucr:ucr
})
    }

    let dataJurnal = {
        tahun:2022,
        jurnal:Jurnal
    }
        transferExpenditure.bulkCreate(arrDataTransfer).then((te)=>{
            return jsonFormat(res, "success", "Berhasil menambahkan data", te);
        }).catch((err)=>{
            return jsonFormat(res, "failed", err.message,"satu")
        })
    }
    catch(err){
        log4js.getLogger.debug(err);
        next(err)
    }
}

exports.getAlltransfer = (req,res,next) =>{
    transferExpenditure.findAll({include:'detailtransfer'}).then((t)=>{
        return jsonFormat(res, "success", "Berhasil menampilkan data", t);
    }).catch((err)=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return jsonFormat(res, "failed", err,[]);
    })
}

exports.getlisttransferbyStatus = (req,res,next) =>{
    transferExpenditure.findAll({where:{status:req.params.status}
    }).then((t)=>{
        if(t.length>0){
            errors.message = "data kosong"
            throw errors
        }
        return jsonFormat(res, "success", "Berhasil menampilkan data", t);
    }).catch((err)=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        log4js.getLogger.debug(err);
        return jsonFormat(res, "failed", err,[]);
    })
}
exports.getlisttransferbykodebank = (req,res,next) =>{
    transferExpenditure.findAll({attributes: {
        exclude: ["ucr","uch","udcr","udch"]
    },where:{kode_bank:req.params.kode_bank, status:0}
    }).then((t)=>{
        return jsonFormat(res, "success", "Berhasil menampilkan data", t);
    }).catch((err)=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return jsonFormat(res, "failedsetstatus", err,[]);
    })
}

exports.getlisttransferbyId = (req,res,next) =>{
    transferExpenditure.findAll({where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_sub_surat:req.params.kode_sub_surat}
    }).then((t)=>{
        if(t){
        
        detailTransfer.findAll({where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_sub_surat:req.params.kode_sub_surat}}).then((b)=>{
        let outPut = [];   
           t.map((x)=>{
            let arrdetail = []
            b.map((a)=>{
                arrdetail.push({
                    "unit_bank":a.unit_bank,
                    "waktu_transfer":a.waktu_transfer,
                    "nama_penentrasfer":a.nama_penentrasfer
                })
            })
            outPut.push({
            "nip": x.nip,
            "nama":x.nama,
            "kode_surat": x.kode_surat,
            "kode_sub_surat": x.kode_sub_surat,
            "nomor_rekening": x.nomor_rekening,
            "kode_bank": x.kode_bank,
            "nama_bank": x.nama_bank,
            "nominal": x.nominal,
            "perihal": x.perihal,
            "status": x.status,
            "detail":arrdetail
            })
           })
            

            return jsonFormat(res, "success", "Berhasil menampilkan data", outPut);
        })
        
    }
    else{
        
        return jsonFormat(res, "failedsetstatus", err,[]);}
    }).catch((err)=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return jsonFormat(res, "failedsetstatus", err,[]);
    })
}

exports.updateStatusTransfer = (req,res,next) =>{
    transferExpenditure.findOne({where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_sub_surat:req.params.kode_sub_surat}})
    .then((t)=>{
        if(t){
            if(t.status===1){
                errors.message = "Status telah dirubah sebelumnya";
                 throw errors;
            }else{
                transferExpenditure.update({status:req.body.status,uch:req.body.uch},{where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_sub_surat:req.params.kode_sub_surat}})
                .then((tu)=>{
                    detailTransfer.create({
                    nip:req.params.nip,
                    kode_surat:req.params.kode_surat,
                    kode_sub_surat:req.params.kode_sub_surat,
                    unit_bank:req.body.unit_bank,
                    waktu_transfer:req.body.waktu_transfer,
                    nama_penentrasfer:req.body.nama_penentrasfer,
                    ucr:req.body.uch
                    }).then((dtc)=>{
                        transferExpenditure.findOne({where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_sub_surat:req.params.kode_sub_surat}}).then((tf)=>{
                            return jsonFormat(res, "success", "Berhasil menampilkan data", tf);
                        })
                    })
                })
            }
        }else{
            errors.message = "data tidak ditemukan";
            throw errors
        }
        
    }).catch((err)=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return jsonFormat(res, "failed", err,[]);
    })
}

exports.siakun = async(req,res,next)=>{
    try{
    const transaksi = req.body.transaksi
    let arrOutput = []
    for(let i = 0;i < transaksi.length;i++){
    let jurnalsiakun = await axios .post(`${hostSiakunBe1}${idAPI.siakun.jurnal_create_pengeluaran}`,
        {
            "tahun":tahun,
            "modul":"Perjalanan Dinas",
            "kode_modul":"M08.01.04",
            "kode_aplikasi":"08",
            "aplikasi":"E-Expenditure",
            "kode_surat":kode_surat,
            "kode_sub_surat":kode_sub_surat,
            "tanggal_transaksi":tanggal_transaksi,
            "keterangan":`Surat Tugas Perjadin ${nama_petugas} - ${kode_sub_surat}`,
            "akun_bas":"524111",
            "norek_aktiva":nomor_rekening_dipakai,
            "norek_pasiva":nomor_rekening_tujuan,
            "remark":`${tahun}-${nama_petugas}-${kode_sub_surat}`,
            "nominal":nominal,
            "kode_rkatu":kode_rkatu,
            "bulan_akhir":bulan_akhir,
            "ucr":ucr
        }
    ).then((p)=>{return `${p.data.message}-${kode_sub_surat}`}).catch((err)=>{return err})
    arrOutput.push(jurnalsiakun)
}
return jsonFormat(res, "success", "Berhasil menampilkan data", arrOutput);

}catch(err){
    return next(err)
}

}

exports.transfer = async(req,res,next) =>{
    //Header UT-Bank
    try{
    const header = getSignature(req.method, "/bri/v1/transfer");
    const body = req.body
    const transaksiData = body.transferData
    let dataResponse = []
        
        let dataTampungBRI = []
        let kode_bank_dipakai = []
        let transferData = []
        const waiting = await waitingTransfer.findAll({where:{nomor_sptd:req.body.nomor_sptd, status:3}})
        const waiting2 = await waitingTransfer.findAll({where:{nomor_sptd:req.body.nomor_sptd}})
    transaksiData.map((t)=>{
        if(t.NoReferral){
            waiting2.map((w2)=>{
                if(`${t.nip}${t.kode_surat}${t.kode_sub_surat}${t.perihal}` === `${w2.nip}${w2.kode_surat}${w2.sub_surat}${w2.perihal}`){
                    transferData.push(t)
                }    
            })
        }else{
        waiting.map((w)=>{
            if(`${t.nip}${t.kode_surat}${t.kode_sub_surat}${t.perihal}` === `${w.nip}${w.kode_surat}${w.sub_surat}${w.perihal}`){
                transferData.push(t)
            }
        })}
    })
    if(transferData.length === 0){
        throw new Error('Tidak ada yang bisa di eksekusi transfer')
    }
        //loop 1 untuk memecah data
    for(let i=0;i<transferData.length;i++){
        let transaksi = transferData[i]
        if(!transaksi.NoReferral){
        updateStatusWaitTF(transaksi,body,'4')
        }
        kode_bank_dipakai.push(body.kode_bank_asal)
        if(body.kode_bank_asal === '002'){
            let dataBRI = await data_ke_bank(transaksi,body)
            console.log('data BRI',dataBRI)
            dataTampungBRI.push(dataBRI)
        }
    }
    
    if(kode_bank_dipakai.includes('002') == true){  
    console.log(dataTampungBRI, header);
    let ResponseBRI = await storetfBRI(dataTampungBRI, header)
    console.log("Response BRI",ResponseBRI)
        ResponseBRI.map((a)=>{
            if(a.data){
                dataResponse.push(a)
            }
        })

    }
    //looping ke 2 untuk siakun dan update status
    for(let i=0;i<transferData.length;i++){
        
        let transaksi = transferData[i]
       
        let dataResponse2 = dataResponse.filter((p)=>p.description == `${body.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}`)
       
        let kondisi = dataResponse.filter((p)=>p.description == `${body.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}` && p.status == 'SUCCESS')        
        let dataSiakun = await data_siakun(transaksi,"a",body)
        let responseSiakun = await storeSiakun(dataSiakun)
        
        if(kondisi.length > 0){
            updateNoReferralWaitTF(transaksi,kondisi[0],"6")
            updatePegawai(transaksi,kondisi[0],1)
        }else{
            updateNoReferralWaitTF(transaksi,dataResponse2[0],"5")
        }
    }
    refSPTD.update({status:2},{where:{nomor:req.body.nomor_sptd}})

    return jsonFormat(res,'success',"Berhasil Memperoses",dataResponse);

    }catch(err){
         log4js.getLogger.debug("transfer: :" + err);
        jsonFormat(res,'failed',err?.message,[])
    }

}

exports.transferNew = (req,res,next) =>{
    const body = req.body
    const transferData = body.transferData
    waitingTransfer.findAll({where:{nomor_sptd:req.body.nomor_sptd}}).then((waitData)=>{
        transferData.map((td)=>{
            let tdresponse
            if(!!td.NoReferral == false){
                
            }
        })
        return jsonFormat(res,'success','berhasil membuat data',transferData)       
    }).catch((err)=>{next(err)})
}



const data_siakun = (transaksi,kondisi,body) =>{
    let date = new Date()
    return {
        "kode_unit":transaksi.kode_unit,
        "tanggal_transaksi":body.tanggal,
        "keterangan":"nomor-sptd:"+transaksi.nomor_sptd+"|nama petugas:"+transaksi.nama_petugas+"|kode trx surat : "+transaksi.kode_surat,
        "kode_menu":"M08.01.04",
        "kode_aplikasi":"08",
        "kode_surat":transaksi.kode_surat,
        "kode_sub_surat":transaksi.kode_sub_surat,
        "akun_aktiva":transaksi.akun_bas_realisasi,
        "akun_pasiva":211119,
        "norek_aktiva":transaksi.nomor_rekening_tujuan,
        "norek_pasiva":transaksi.nomor_rekening_dipakai,
        "nominal":transaksi.nominal,
        "kode_rkatu":transaksi.kode_rkatu,
        "bulan_akhir":transaksi.bulan_akhir,
        "tahun":body.tahun,
        "ucr":body.ucr
    }
}

const data_ke_bank = (transaksi,data) =>{
    let cb
    if(transaksi.NoReferral){
        cb = {
            "NoReferral":transaksi.NoReferral,
            "sourceAccountCode":transaksi.kode_bank_asal,
            "sourceAccount":transaksi.nomor_rekening_dipakai,
            "beneficiaryAccountCode":transaksi.kode_bank_tujuan,
            "beneficiaryAccount":transaksi.nomor_rekening_tujuan,
            "beneficiaryName":transaksi.nama_petugas,
            "beneficiaryEmail": transaksi?.email,
            "documentCode":`${data.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}`,
            "amount":transaksi.nominal,
            "description":`${data.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}`,
            "device":data.device,
            "browser":data.browser,
            "location":data.location,
            "ucr": data.ucr
        }
    }else{
        cb = {
            "sourceAccountCode":transaksi.kode_bank_asal,
            "sourceAccount":transaksi.nomor_rekening_dipakai,
            "beneficiaryAccountCode":transaksi.kode_bank_tujuan,
            "beneficiaryAccount":transaksi.nomor_rekening_tujuan,
            "beneficiaryName":transaksi.nama_petugas,
            "beneficiaryEmail": transaksi?.email,
            "documentCode":`${data.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}`,
            "amount":transaksi.nominal,
            "description":`${data.tahun}-${transaksi.nama_petugas}-${transaksi.kode_surat}-${transaksi.kode_sub_surat}`,
            "device":data.device,
            "browser":data.browser,
            "location":data.location,
            "ucr": data.ucr
        }
    }
    return cb
}


const storetfBRI = async(data,header)=>{
        const dataObject = {
            dataTransfer:data
        }
        console.log("dataobj : ", dataObject);
        let response =  await axios.post(`${hostutpay}${idAPI.utpay.transfer}`,dataObject,{headers: header})
        console.log("dari UT PAY",response.data)
        return response.data
}

const storeSiakun = (data) =>{
    return axios.post(`${hostSiakunBe1}${idAPI.siakun.transaksi_jurnal_store}`,data).then((a)=>a)
}

const updateNoReferralWaitTF = (data,body,status) =>{
    return waitingTransfer.update({status:status,NoReferral:99999999999999999918,kode_bank_asal:data.kode_bank_asal,nomor_rekening_dipakai:data.no_rekening_asal},{where:{nip:data.nip,kode_surat:data.kode_surat,sub_surat:data.kode_sub_surat,perihal:data.perihal}})
}

const updateStatusWaitTF = (data,body,status) =>{
    return waitingTransfer.update({status:status,kode_bank_asal:data.kode_bank_asal,nomor_rekening_dipakai:data.nomor_rekening_asal},{where:{nip:data.nip,kode_surat:data.kode_surat,sub_surat:data.kode_sub_surat,perihal:data.perihal}})
}

const updatePegawai = (data,body,status) =>{
    return PetugasPerjadinBiaya.update({status_pengusulan:status,kode_bank_asal:data.kode_bank_asal,nomor_rekening_dipakai:data.no_rekening_asal},{where:{nip:data.nip,id_surat_tugas:data.kode_surat,kode_kota_tujuan:data.kode_sub_surat}})
}