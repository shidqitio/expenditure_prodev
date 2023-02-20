const axios = require("axios");
const { jsonFormat } = require("../utils/jsonFormat");
const request = require("request");
const tVA = require("../models/t_VA");
const spjPerorang =require("../models/trx_spj_perorang_perjadin");
const hostSiakunBe1 = process.env.hostSiakunBe1
const idAPI = require("../lang/id-api.json")
const siakun = require("../middleware/siakun")

exports.createVirtualAccount = async(req,res,next)=>{
    let nip = req.body.nip
    let kode_surat = req.body.kode_surat
    let kode_sub_surat = req.body.kode_sub_surat
    let kode_bank = req.body.kode_bank
    let nominal = req.body.nominal
    let ucr = req.body.ucr
    let characters ='Expenditure';
    randomchar = '';
    charactersLength = characters.length;
    for ( let i = 0; i < 11; i++ ) {
        randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let kode_VA = kode_surat+randomchar+nip+kode_sub_surat;
    tVA.create({
        nip:nip,
        kode_surat:kode_surat,
        kode_sub_surat:kode_sub_surat,
        kode_VA:kode_VA,
        kode_bank:kode_bank,
        nominal:nominal,
        ucr:ucr,
        status:0
    }).then((create)=>{jsonFormat(res, "success", "pembuatan virtual account berhasil", create);}).catch((err)=>{jsonFormat(res, "failed", err.message, []);})
}

exports.pushNotifVA = (req,res,next) =>{
    spjPerorang.findOine(({where:{nomor_virtual_account:req.params.kode_VA}})).then((data) =>{
        if(data == null){
            throw new Error("data tidak ada")
        }
        return spjPerorang.update({status:"+00"},{where:{nomor_virtual_account:req.params.kode_VA}}).then((va)=>{ 
        let tanggal = new Date().toISOString().slice(0, 10)
//        siakun.ReversalPagu
// (tahun,
//          kode_menu,
//          id_surat_tugas,
//       //   tanggal,
//          nomor_surat_tugas,
//          kode_rkatu,
//          kode_periode,
//          nominal,
//          ucr);
       
        let dataSiakun = {
            "tahun":data.tahun,
            "kode_aplikasi":"08",
            "kode_menu":"M08.01.04",
            "kode_surat":data.id_surat_tugas,
            "kode_sub_surat":data.nip +"kota tujuan:"+data.kota_tujuan,
            "tanggal_transaksi":tanggal,
            "keterangan":`Pengembalian - Nomor surat:${data.nomor_surat_tugas}`,
            "kode_rkatu":data.kode_rka,
            "bulan_rkatu":data.bulan_rka,
            "nominal":data.nominal,
            "ucr":"ATM-BANK"
        }
          let lemparsiakun = axios .post(`${hostSiakunBe1}${idAPI.siakun.pagu_reversal}`,dataSiakun).catch(()=>0)
            jsonFormat(res,"success","Berhasil mengupdate VA",va)
        })
    })
    .catch((err)=>{
        next(err)
    })
}