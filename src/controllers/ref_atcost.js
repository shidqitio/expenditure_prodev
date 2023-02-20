const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const SkemaPerjadin = require("../models/ref_skema_perjadin");
const { validationResult } = require("express-validator");
const Status =require("../models/ref_status");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const KomponenPerjadin_1 = require("../models/trx_komponen_perjadin_1");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const SuratTugashonor = require("../models/ref_surat_tugas_honor");
const refSpmatCost = require("../models/ref_spm_atcost");
const SuratAtcost = require("../models/ref_surat_atcost");
const spjPerorang =require("../models/trx_spj_perorang_perjadin");
const { QueryTypes,Op,fn,col,where } = require("sequelize");
const db = require("../config/database");
const { type } = require("express/lib/response");
const fs = require('fs');
const puppeteer  = require("puppeteer");
const path = require("path");
const hostPevita = process.env.hostPevita 
const hostProdevPanutan = process.env.hostProdevPanutan


exports.coba = async (req,res,next) =>{
 await spjPerorang.sum('nominal',{  where:[
    where(
        fn('CONCAT', col('kode_surat'), '-', col('nip'), col('kode_nomor_spm'), col('kode_kota_tujuan')), 
        { [Op.in]:req.body.datapengajuanatcost })
] }).then((data)=>{
    jsonFormat(res, "success", "berhasil", data) 
}).catch((err)=>{ jsonFormat(res, "failed", err.message, "dua")}) 
}

exports.getnomorspmatcost = async (req,res,next) =>{
try{
    const nominal = await spjPerorang.sum('nominal',{  where:[
        where(
            fn('CONCAT', col('kode_surat'), '-', col('nip'), '-', col('kode_kota_tujuan')), 
            { [Op.in]:req.body.datapengajuanatcost })
    ] });
    const maxKode = await dokumenKirimPanutan.max('id_trx')+2
    await axios .post(`${hostPevita}/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`).then((apiToken)=>{
        if(apiToken.data.access_token){
       let token = apiToken.data.access_token
       return axios .post(`${hostPevita}/utapi/public/api/lat_nosurat`,{
            "aplikasi":"expenditure",
            "sifat_surat":"b",
            "id_surat": maxKode,
            "id_jenis_surat":req.body.id_jenis_surat,
            "id_jenis_nd":req.body.id_jenis_nd,
            "perihal":"SPM-atcost",
            "id_klasifikasi":req.body.id_klasifikasi,
            "id_sub_unit":req.body.id_sub_unit,
            "id_user":req.body.id_user,        
            "nama_pembuat":req.body.nama_pembuat,
            "tanggal":req.body.tanggal
       },{ headers: { Authorization: `Bearer ${token}` }}).then((apiNomor)=>{
        let nomor = apiNomor.data
        return db.transaction().then((t)=>{
             dokumenKirimPanutan.create({
                katagori_surat:"SPM-atcost",
                id_surat_tugas:maxKode,
                kode_unit:req.body.kode_unit,
                tahun:req.body.tahun,
                tanggal:req.body.tanggal,
                jenis_surat:"SPM",
                id_nomor:nomor.id_nomor,
                nomor:nomor.nomor,
                aktif:1
            },{transaction:t}).then((dataDokumen)=> {
                refSpmatCost.create({
                    nomor_surat_spm:nomor.nomor,
                    kode_nomor_spm:nomor.id_nomor,
                    nominal:nominal,
                    status:"01",
                    ucr:req.body.ucr
                },{transaction:t}).then((dataatcost)=>{
                    spjPerorang.update({kode_nomor_spm:nomor.id_nomor},{  where:[
                        where(
                            fn('CONCAT', col('kode_surat'), '-', col('nip'), col('kode_nomor_spm'), col('kode_kota_tujuan')), 
                            { [Op.in]:req.body.datapengajuanatcost } )
                    ],transaction:t }).then((updateSPJ)=>{
                        if(updateSPJ == 0){
                            let err = new Error('data tidak ada yang diproses')
                            throw err
                        }
                        t.commit()
                        jsonFormat(res, "success", "berhasil", updateSPJ) 
                    }).catch((err)=>{ t.rollback(); jsonFormat(res, "failed", err.message, "gak bisa update")})
                }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa create")})
            }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "gak bisa create")})
        }).catch((err)=>{ jsonFormat(res, "failed", err.message, "API get nomor error")})
       }).catch((err)=>{ jsonFormat(res, "failed", err.message, "API get nomor error")})
    } else{
    let err = new Error("API pevita tidak merespon")
    throw err
    }
    }).catch((err)=>{ jsonFormat(res, "failed", err.message, "dua")})  
}catch(err){
    next(err)
}
}


exports.listSPM = async(req,res,next) =>{
    await refSpmatCost.findAll({attributes: {
        exclude: ["ucr","uch","udcr","udch"]
    }}).then((data)=>{
        if(data.length == 0){
            let err = new Error("data tidak Ada")
            throw err
        }
        jsonFormat(res,"succcess","berhasil Menampilkan Data", data)
    }).catch((err)=>{
        jsonFormat(res,"failed",err.message,[])
    })
}

exports.detailSPM = async(req,res,next) =>{

    await refSpmatCost.findOne({where:{
        kode_nomor_spm:req.params.kode_nomor_spm
    }, include:{model:spjPerorang,
        attributes: {
            exclude: ["ucr","uch","udcr","udch"]
        }
    },attributes: {
        exclude: ["ucr","uch","udcr","udch"]
    }}).then((data)=>{
        if(data == null){
            let err = new Error("data tidak Ada")
            throw err
        }
        console.log(data)
        jsonFormat(res, "success", "Berhasil memuat data", data);
    }).catch((err)=>{
        jsonFormat(res,"failed","gagal","satu")
    })
}

exports.renderSPM = async(req,res,next) =>{
    let characters ='EXPENDITUREperjalanandinashonorariumbarangdanjasa2374506189';
    randomchar = '';
    charactersLength = characters.length;
    for ( let i = 0; i < 15; i++ ) {
        randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const gettoken = await axios .post(`${hostPevita}/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`).then((data)=>{
        if(!data.data.access_token){
            return data.data.access_token
        }else{
            return null
        }
    })
    //Deklarasi variable
    let scriptHtml = req.body.scriptHtml
    let id_trx = req.body.id_trx

    //RENDER PDF
   const pdf =(
        scriptHtml
      );
     let browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox"],headless : true})
     let page = await browser.newPage()
    await page.setContent(pdf)
    let folderpath = "./src/public/atcost"
    let buffer = await page.pdf({
        path : folderpath+'/expsipppatc_'+randomchar+'.pdf',
      // paperWidth:8.5,
      // paperHeight:13,
      format: 'Legal',
        printBackground: true,
        margin: {
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px'
        }
    })
    await browser.close();
    let pathpdf = path.join(__dirname,"../public/atcost/",'/expsipppatc_'+randomchar+'.pdf');
    let fileexist = fs.existsSync(pathpdf)
    let pdfupload = fs.createReadStream(pathpdf);
    data = new FormData();
            data.append('email', 'expenditure@ecampus.ut.ac.id');
            data.append('password', 'password123');
            data.append('id_aplikasi', '4');
            data.append('id_trx', id_trx);
            data.append('sifat_surat', sifat_surat);
            data.append('nomor_surat', nomor_surat);
            data.append('perihal', perihal);
            data.append('tanggal_surat', tanggal_surat);
            data.append('nip_penandatangan',nip_penandatangan );
            data.append('email_penandatangan', email_penandatangan);
            data.append('pdf', pdfupload);
            
            var config = {
                method: 'post',
                url: `${hostProdevPanutan}/nadinetest/public/api/external/send_data`,
                headers: { 
                   Authorization: `Bearer ${token}`, 
                  
                  ...data.getHeaders()
                },
                data : data
              };

             await axios(config).then((response) =>{
                dokumenKirimPanutan.update({link_file:'expsipppatc_'+randomchar+'.pdf'},{where:{
                    id_trx:id_trx,link_file:null
                  }}).then((data)=>{
                    if(data === 0){
                        let err = new Error('data tidak terupdate')
                        throw err
                    }
                    jsonFormat(res, "success", "Berhasil memuat data", data);
                  }).catch((error)=>{
                    fs.unlink(pathpdf)
                    jsonFormat(res,"failed",error.message,"satu")
                  })
               }).catch((error) => {
                fs.unlink(pathpdf)
                jsonFormat(res,"failed",error.message,"satu")
               });

    

}

exports.create = async(req,res,next) =>{
   try{
    const nominal = await spjPerorang.sum('nominal',{  where:[
        where(
            fn('CONCAT', col('kode_surat'), '-', col('nip'), '-', col('kode_kota_tujuan')), 
            { [Op.in]:req.body.datapengajuanatcost })
    ] });
    jsonFormat(res,"success","berhasil",nominal)
}catch(err){
    next(err)
}
}