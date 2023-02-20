const { jsonFormat } = require("../utils/jsonFormat");
const uuidv4 = require('uuid/v4');
const axios = require("axios");
const request = require("request");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const verifikasiSurat = require("../models/trx_verifikasi_surat");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const fs = require('fs');
//const fsPromise = require('fs/promises');
const puppeteer  = require("puppeteer");
const path = require("path");
// const https = require('https');
var FormData = require('form-data');
const hostsiakun = process.env.hostSiakun
const hostSiakunBe1 = process.env.hostSiakunBe1
const hostEbudgeting = process.env.hostEbudgeting
const generate = require("../utils/generate");
//const hostEbudgeting = `https://dev-sippp.ut.ac.id:9000`
const hostPevita = process.env.hostPevita
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const idAPI = require("../lang/id-api.json")

exports.penguranganrka = async (req,res,next) => {

  try {
  let cekrka = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${req.body.kode_RKA}/${req.body.kode_periode}`).catch(()=>{return new Error('Error Ebudgeting')});
  let rkamap = cekrka.data
      if (rkamap.length === 0){
          jumlah_rka = 0;
           
      }else{jumlah_rka = rkamap.jumlah;}
     
       let sisa_rka = (jumlah_rka-req.body.jumlah_budget);
      
       const gettoken = await axios .post(`${hostPevita}${idAPI.pevita.login}`)
      .catch(function(error){
       jsonFormat(res, "failed", error.message, []);})
      const token = gettoken.data["access_token"];
      
      if(req.body.jumlah_budget < 1)
      
      {throw new Error('data tidak memiliki budget');}
      if(sisa_rka < 0)
      {throw new Error('sisa RKA tidak mencukupi');}
      
      let surat = req.body.surat
      let arrcek = []
      let jumlah = 0
      let datasurat = {
        'surat':req.body.surat,
        'katagori_surat':req.body.katagori_surat,
        'sifat_surat':req.body.sifat_surat,
        'id_jenis_surat':req.body.id_jenis_surat,
        'id_jenis_nd':req.body.id_jenis_nd,
        'perihal':req.body.perihal,
        'id_klasifikasi':req.body.id_klasifikasi    
      }

      const maxDok = await dokumenKirimPanutan.max('id_trx');
      for(let i=0;i<surat.length;i++){
      
      let sifat_surat = datasurat.surat[i].sifat_surat;
      let katagori_surat = datasurat.surat[i].katagori_surat;
      let id_jenis_surat = datasurat.surat[i].id_jenis_surat;
      let id_jenis_nd = datasurat.surat[i].id_jenis_nd;
      let perihal = datasurat.surat[i].perihal;
      let id_klasifikasi = datasurat.surat[i].id_klasifikasi;
      let type_surat = datasurat.surat[i].type_surat;
      const maxDokumen = parseInt(maxDok)+i+1

     let getNomor = await  axios .post(`${hostPevita}${idAPI.pevita.lat_nosurat}`,{
          "aplikasi":"expenditure",
          "sifat_surat":sifat_surat,
          "id_surat":maxDokumen,
          "id_jenis_surat":id_jenis_surat,
          "id_jenis_nd":id_jenis_nd,
          "perihal":perihal,
          "id_klasifikasi":id_klasifikasi,
          "id_sub_unit":req.body.id_sub_unit,
          "id_user":req.body.id_user,        
          "nama_pembuat":req.body.ucr,
          "tanggal":req.body.tanggal
      },{ headers: { Authorization: `Bearer ${token}` }}).then((nomortbl)=>{
        arrcek.push(nomortbl.data);
         return nomortbl;
      }).catch(function (error) {
        throw new Error('nomor surat tidak didapat');
      });
      console.log('respon pevita',getNomor)
      let id_nomor = getNomor.data["id_nomor"];
      let nomor = getNomor.data["nomor"]

     await dokumenKirimPanutan.update({aktif:0},{where:{
        katagori_surat:katagori_surat,
        id_surat_tugas:req.body.id_surat_tugas,
        kode_unit:req.body.kode_unit,
        tahun:req.body.tahun,
        jenis_surat:type_surat,
        id_nomor:id_nomor,
        nomor:nomor
      }}).then().catch((err)=>{throw err})

      await dokumenKirimPanutan.create({
        id_trx:maxDokumen,
        katagori_surat:katagori_surat,
        id_surat_tugas:req.body.id_surat_tugas,
        kode_unit:req.body.kode_unit,
        tahun:req.body.tahun,
        tanggal:req.body.tanggal,
        jenis_surat:type_surat,
        id_nomor:id_nomor,
        nomor:nomor,
        aktif:1
     }).catch((err)=>{throw err})
    }
      let dataSiakun = {
        "tahun":req.body.tahun,
        "kode_aplikasi":"08",
        "kode_menu":"M08.01.04",
        "kode_surat":req.body.id_surat_tugas,
        "kode_sub_surat":"-",
        "tanggal_transaksi":req.body.tanggal,
        "keterangan":`Surat Tugas Perjadin - Nomor surat:${req.body.nomor_surat_tugas}`,
        "kode_rkatu":req.body.kode_RKA,
        "bulan_rkatu":req.body.kode_periode,
        "nominal":req.body.jumlah_budget,
        "ucr":req.body.ucr
    }
      let lemparsiakun = await axios .post(`${hostSiakunBe1}${idAPI.siakun.pagu_store}`,dataSiakun).catch(()=>0)
      
      const suratTugas =  await SuratTugasPerjadin.update({kode_status:3},{where:{id_surat_tugas :req.body.id_surat_tugas}});

          jsonFormat(res, "success", "Rincian kegiatan anggaran telah dikurangiaaaaaaaaa",suratTugas);
        } catch (error) {
          jsonFormat(res, "failed", error.message,error);
        }        
}


exports.renderdankirim = async (req,res,next) => {
  try{
  let dokumen = req.body.dokumen
  let datadokument = {
    'dokumen':req.body.dokumen,
    'scriptHtml':req.body.scriptHtml,
    'id_jenis_surat':req.body.id_jenis_surat,
    'id_jenis_nd':req.body.id_jenis_nd,
    'perihal':req.body.perihal,
    'id_klasifikasi':req.body.id_klasifikasi , 
    'id_trx':req.body.id_trx,
    'sifat_surat':req.body.sifat_surat,
    'id_nomor':req.body.id_nomor,
    'jenis_surat':req.body.jenis_surat,
    'nomor_surat':req.body.nomor_surat,
    'perihal':req.body.perihal,
    'tanggal_surat':req.body.tanggal_surat,
    'nip_penandatangan':req.body.nip_penandatangan,
    'email_penandatangan':req.body.email_penandatangan,
  }

  const gettoken = await axios .post(`${hostPevita}${idAPI.pevita.login}`).catch(function(error){
    jsonFormat(res, "failed", error.message, []);
  });
  const token = gettoken.data["access_token"];
 
let scriptHtml,id_jenis_surat,id_jenis_nd,perihal,id_klasifikasi,id_trx,sifat_surat,nomor_surat,tanggal_surat,nip_penandatangan,email_penandatangan,pdf,
browser,page,buffer,randomchar,charactersLength,folderpath, data,nip_pembuat;
let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
console.log("dokumen length:",dokumen.length)
let arrresponpanutan = [];
          for(let i =0; i<dokumen.length;i++){
            scriptHtml = datadokument.dokumen[i].scriptHtml
           id_jenis_surat = datadokument.dokumen[i].id_jenis_surat
           id_jenis_nd = datadokument.dokumen[i].id_jenis_nd
           perihal = datadokument.dokumen[i].perihal
           id_klasifikasi = datadokument.dokumen[i].id_klasifikasi
           id_trx = datadokument.dokumen[i].id_trx
           sifat_surat = datadokument.dokumen[i].sifat_surat
           id_nomor = datadokument.dokumen[i].id_nomor
           nomor_surat = datadokument.dokumen[i].nomor_surat
           tanggal_surat = datadokument.dokumen[i].tanggal_surat
           nip_pembuat = datadokument.dokumen[i].nip_pembuat
           nip_penandatangan = datadokument.dokumen[i].nip_penandatangan
           email_penandatangan = datadokument.dokumen[i].email_penandatangan
           //render pdf
           arrresponpanutan.push(datadokument.dokumen[i])
             pdf =(
              scriptHtml
            );
           browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
           page = await browser.newPage()
          await page.setContent(pdf)
          randomchar = '';
              charactersLength = characters.length;
              for ( let i = 0; i < 15; i++ ) {
                  randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              folderpath = "./src/public/perjadin"
              fs.mkdir(folderpath,function(e){
            });

          buffer = await page.pdf({
                  path : folderpath+'/expsipppper_'+randomchar+'.pdf',
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
            // kirim ke panutan
            let filename = 'expsipppper_'+randomchar+'.pdf'
              let pathpdf = path.join(__dirname,"../public/perjadin/",'/expsipppper_'+randomchar+'.pdf');
            generate.kirimpanutan(pathpdf,filename,sifat_surat,id_trx,nomor_surat,perihal,tanggal_surat,nip_pembuat,nip_penandatangan,req.body.tahun)
            }

            await PetugasPerjadinBiaya.update({nomor_rekening_dipakai:req.body.nomor_rekening_dipakai},{where:{id_surat_tugas:req.body.id_surat_tugas}})
              jsonFormat(res, "success", "berhasil", arrresponpanutan);
            }
            catch(error){jsonFormat(res, "failed", error.message, []);}
}

exports.penguranganrkaNew = async(req,res,next) =>{
  
  try{
  let cekrka = await axios.get(`${hostEbudgeting}${idAPI.ebudgeting.rka_bulan}/${req.body.kode_RKA}/${req.body.kode_periode}`).then((ebudgeting)=>{
  if(ebudgeting.data.status == 'failed'){
    let err = new Error(ebudgeting.data.message)
    throw err
  }
  return ebudgeting.data.values[0].jumlah
  }).catch((err)=>{
    throw err
  })

  let rkaInt = parseInt(cekrka)

  if(rkaInt < req.body.jumlah_budget){
    let err = new Error('SISA RKA tidak memenuhi untuk mengeksekusi biaya ini')
    throw err
  }

  


}catch(err){
   next(err)
}
}

let siakun = async(data)=>{
  let lemparsiakun = await axios .post(`${hostSiakunBe1}${idAPI.siakun.store_pagu}`,{
    "tahun":data.tahun,
    "aplikasi":"E-Expenditure",
    "kodemodul":data.modul,
    "kode_surat":data.kode_surat,
    "kode_sub_surat":"-",
    "tanggal_transaksi":data.tanggal,
    "keterangan":`Surat Honorarium - ${data.nomor_surat_tugas}`,
    "kode_rkatu":data.kode_rkatu,
    "bulan_rkatu":data.bulan_rkatu,
    "nominal":data.nominal,
    "ucr":data.ucr
    }).then((response)=>{
      console.log("cek siakun:",response)
      return response.data})
  .catch((err)=>{throw new Error(`Error siakun ${err.message}`)})
  return lemparsiakun
}






