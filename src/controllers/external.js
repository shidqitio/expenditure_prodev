const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op,fn,col } = require("sequelize");
const db = require("../config/database");
const puppeteer  = require("puppeteer");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
// const { get } = require("express/lib/response");
const fs = require('fs');
const https = require('https');
const path = require("path");
const request = require('request');
const hostProdevPanutannew = process.env.hostProdevPanutannew

exports.getCharteBudgetingbyRKA = async (req,res,next) => {
let jumlah_rka, rka_terpakai,sisa_rka;
    const e_budgeting = await axios.get(`https://dev-sippp.ut.ac.id:4900/e_budgeting/apiv1/expenditure/pagu/${req.params.id}`);
const datapagu = e_budgeting.data.values;
const datarkaterpakai = await db.query(`SELECT sum(jumlah) as jumlah FROM (SELECT ifnull(sum(jumlah_budget),0) jumlah FROM ref_surat_tugas_rka_perjadin WHERE kode_rka = ${req.params.id} 
UNION 
SELECT ifnull(sum(jumlah_budget),0) jumlah FROM ref_surat_tugas_rka_honor WHERE kode_rka = ${req.params.id}) as B`,
{type:QueryTypes.SELECT}
);
if(datapagu.jumlah === null){
    jumlah_rka = 0;
}else{jumlah_rka = datapagu[0].jumlah}

rka_terpakai = parseInt(datarkaterpakai[0].jumlah);
sisa_rka = jumlah_rka-rka_terpakai;
console.log("cek rkaterpakai",rka_terpakai);

let arrdata = [];
arrdata.push({
   jumlah_rka:jumlah_rka,
   rkaterpakai:rka_terpakai,
   sisa_rka:sisa_rka,
    from_ebudgeting: datapagu,
    
});


try { 
    jsonFormat(res, "success", "data tampil", arrdata);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }

}

exports.getforchart = async (req,res,next) => {

  const arrTriwulan = await db.query(`SELECT triwulan from tabel_realisasi_chart GROUP BY triwulan`,{type:QueryTypes.SELECT});

  const tbTriwulan = await db.query(`SELECT triwulan,bulan,persen FROM tabel_realisasi_chart ORDER BY triwulan, urut`,{type:QueryTypes.SELECT});

  let arrData = []
  arrTriwulan.map((at) => {
    let arrBulan =[]
    tbTriwulan.map((tt) =>{
      if(tt.triwulan===at.triwulan){
        arrBulan.push({
          bulan:tt.bulan,
          pesen:tt.persen
        })
      }
    })
    arrData.push({
      triwulan: at.triwulan,
      detail_triwulan:arrBulan
    })
  })
  try { 
    jsonFormat(res, "success", "data tampil", arrData);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.ganttchart = async (req,res,next) =>{
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  const expendituregantt = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan`)
  const aktivitas = e_budgeting.data.aktivitas;
  const realisasivalues = expendituregantt.data.values;
  let arrAktivitas = [];
  aktivitas.map((ak) => {
    let arrsubAtivitas = [];
   
    ak.subAktivitas.map((sak)=>{
     let arrrealisasi = [];
     let arrrencanatarget = [];
     
     sak.rencanaTarget.map((rt)=>{
       arrrencanatarget.push({
         key:rt.key,
         bulan_awal:rt.bulan_awal,
         bulan_akhir:rt.bulan_akhir,
         persen:rt.persen,
         jumlah:rt.jumlah
       });
       realisasivalues.map((rv)=>{
         if(rv.kode_aktivitas_rkatu === ak.key && rv.kode_trx_rkatu === sak.key
           && rv.kode_periode === rt.key){
             arrrealisasi.push({
               key:rv.kode_periode,
               bulan_awal:rv.bulan_awal,
               bulan_akhir:rv.bulan_akhir,
               persen:rv.jumlah*(100-rv.bulan_akhir*2)/100/sak.alokasi_aktivitas_sub*100,
               jumlah:rv.jumlah*(100-rv.bulan_akhir*2)/100
             })
           }
       })
 
 
     })
     arrsubAtivitas.push({
       key:sak.key,
       nama_aktivitas_sub:sak.nama_aktivitas_sub,
       BAS:sak.BAS,
       alokasi_aktivitas_sub:sak.alokasi_aktivitas_sub,
       rencanaTarget :arrrencanatarget,
       realisasi:arrrealisasi
     })
   })
 
   arrAktivitas.push({
     key: ak.key,
     nama_aktivitas: ak.nama_aktivitas,
     alokasi_aktivitas: ak.alokasi_aktivitas,
     subAktivitas: arrsubAtivitas
   });
  });
 //console.log("cek_ebudgeting",arrAktivitas);
 return jsonFormat(res, "success", "data tampil", arrAktivitas);
 }


 exports.ganttchartmerger = async (req,res,next) =>{
  
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  const expenditure = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan`)
  const aktivitas = e_budgeting.data.aktivitas;
  const realisasivalues = expenditure.data.values;
  let arrAktivitas = [];
  aktivitas.map((ak) => {
    let arrsubAtivitas = [];
   
    ak.subAktivitas.map((sak)=>{
     let arrrealisasi = [];
     //let arrrencanatarget = [];
     
     sak.rencanaTarget.map((rt)=>{
       let realpersen = 0;
       let realjumlah = 0;
       realisasivalues.map((rv)=>{
         if(rv.kode_aktivitas_rkatu === ak.key && rv.kode_trx_rkatu === sak.key
           && rv.kode_periode === rt.key){
             realpersen = rv.jumlah*(100-rv.bulan_akhir*2)/100/sak.alokasi_aktivitas_sub*100;
             realjumlah = rv.jumlah*(100-rv.bulan_akhir*2)/100;
             
           }
       })
       arrrealisasi.push({
         key:rt.key,
         bulan:rt.bulan_akhir,
         rt_persen:rt.persen,
         ex_persen: realpersen,
         rt_jumlah:rt.jumlah,
         ex_jumlah:realjumlah
       });
       
 
 
     })
     arrsubAtivitas.push({
       key:sak.key,
       nama_aktivitas_sub:sak.nama_aktivitas_sub,
       BAS:sak.BAS,
       alokasi_aktivitas_sub:sak.alokasi_aktivitas_sub,
       //rencanaTarget :arrrencanatarget,
       realisasi:arrrealisasi
     })
   })
 
   arrAktivitas.push({
     key: ak.key,
     nama_aktivitas: ak.nama_aktivitas,
     alokasi_aktivitas: ak.alokasi_aktivitas,
     subAktivitas: arrsubAtivitas
   });
  });
 //console.log("cek_ebudgeting",arrAktivitas);
 return jsonFormat(res, "success", "data tampil", arrAktivitas);
 }

 exports.ganttchartmergernew1 = async (req,res,next) =>{
  
  let arrRealisasiRKA = [{

  }]
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  const expenditure = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan`);

  const aktivitas = e_budgeting.data.aktivitas;
  const realisasivalues = expenditure.data.values;
 // let arrAktivitas = [];
  let arrsubAtivitas = [];
  let arrbulan = ["","Januari","Febuari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  
  console.log("Bulan ",arrbulan[1]);
  aktivitas.map((ak) => {
    
   
    ak.subAktivitas.map((sak)=>{
     let arrrealisasi = [];
     //let arrrencanatarget = [];
     
     sak.rencanaTarget.map((rt)=>{
       let realpersen = 0;
       let realjumlah = 0;
       realisasivalues.map((rv)=>{
         if(rv.kode_aktivitas_rkatu === ak.key && rv.kode_trx_rkatu === sak.key
           && rv.kode_periode === rt.key){
             realpersen = rv.jumlah*(100-rv.bulan_akhir*2)/100/sak.alokasi_aktivitas_sub*100;
             realjumlah = rv.jumlah*(100-rv.bulan_akhir*2)/100;
             
           }
       })
       arrrealisasi.push({
         key:rt.key,
         bulan:rt.bulan_akhir,
         nama_bulan: arrbulan[rt.bulan_akhir],
         rt_persen:rt.persen,
         ex_persen: realpersen,
         rt_jumlah:rt.jumlah,
         ex_jumlah:realjumlah
       });
       
 
 
     })
     arrsubAtivitas.push({
       //key:sak.key,
       kode_aktivitas: ak.key,
       nama_aktivitas:ak.nama_aktivitas,
       alokasi_aktivitas:ak.alokasi_aktivitas,
       kode_aktifitas_sub:sak.key,
       nama_aktivitas_sub:sak.nama_aktivitas_sub,
       BAS:sak.BAS,
       alokasi_aktivitas_sub:sak.alokasi_aktivitas_sub,
       //rencanaTarget :arrrencanatarget,
       realisasi:arrrealisasi
     })
   })
 
  //  arrAktivitas.push({
  //    key: ak.key,
  //    nama_aktivitas: ak.nama_aktivitas,
  //    alokasi_aktivitas: ak.alokasi_aktivitas,
  //    subAktivitas: arrsubAtivitas
  //  });
  });
 //console.log("cek_ebudgeting",arrAktivitas);
 return jsonFormat(res, "success", "data tampil", arrsubAtivitas);
 }

 exports.gannewmerger =  async (req,res,next) =>{
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  const aktivitas = e_budgeting.data.values.aktivitas;
  const realisasidaripengurangan = await SuratTugasRKAPerjadin.findAll({
    attributes: [`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`,
     [fn('sum', col(`jumlah_budget`)),`jumlah_budget`]],
     group :[`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`]});
   console.log(realisasidaripengurangan)
  
     let arrrealisasiRKA = [{
      "kode_kegiatan_ut_detail": 0,
      "kode_aktivitas_rkatu": 0,
      "kode_periode": 0,
      "jumlah_budget": 0,
      "kode_RKA":0,
    }]
     realisasidaripengurangan.map((rdr)=>{
      let jumlah_budget = parseInt(rdr.jumlah_budget) 
      arrrealisasiRKA.push({
        "kode_kegiatan_ut_detail": rdr.kode_kegiatan_ut_detail,
        "kode_aktivitas_rkatu": rdr.kode_aktivitas_rkatu,
        "kode_periode": rdr.kode_periode,
        "jumlah_budget": jumlah_budget,
        "kode_RKA":rdr.kode_RKA,
      })
     })
     

 }

 exports.ganttchartmergernew = async (req,res,next) =>{
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  const expenditure = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan`);

  const aktivitas = e_budgeting.data.aktivitas;
  const realisasivalues = expenditure.data.values;
  const realisasidaripengurangan = await SuratTugasRKAPerjadin.findAll({
    attributes: [`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`,
     [fn('sum', col(`jumlah_budget`)),`jumlah_budget`]],
     group :[`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`]});
   console.log(realisasidaripengurangan)
  
     let arrrealisasiRKA = [{
      "kode_kegiatan_ut_detail": 0,
      "kode_aktivitas_rkatu": 0,
      "kode_periode": 0,
      "jumlah_budget": 0,
      "kode_RKA":0,
    }]
     realisasidaripengurangan.map((rdr)=>{
      let jumlah_budget = parseInt(rdr.jumlah_budget) 
      arrrealisasiRKA.push({
        "kode_kegiatan_ut_detail": rdr.kode_kegiatan_ut_detail,
        "kode_aktivitas_rkatu": rdr.kode_aktivitas_rkatu,
        "kode_periode": rdr.kode_periode,
        "jumlah_budget": jumlah_budget,
        "kode_RKA":rdr.kode_RKA,
      })
     })
 // let arrAktivitas = [];
  let arrsubAtivitas = [];
  let arrbulan = ["","Januari","Febuari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  
  console.log("Bulan ",arrbulan[1]);
  aktivitas.map((ak) => {
    
   
    ak.subAktivitas.map((sak)=>{
     let arrrealisasi = [];
     //let arrrencanatarget = [];
     
     sak.rencanaTarget.map((rt)=>{
       let realpersen = 0;
       let realjumlah = 0;
       let bulan_periode = parseInt(rt.bulan_akhir)
       arrrealisasiRKA.map((rv)=>{
          if(
            rv.kode_aktivitas_rkatu === ak.key &&
             rv.kode_RKA === sak.key
            &&
             rv.kode_periode === bulan_periode
            ){
             realpersen = rv.jumlah_budget/sak.alokasi_aktivitas_sub*100;
             realjumlah = rv.jumlah_budget;
             
          }
       })
       arrrealisasi.push({
         key:rt.key,
         bulan:rt.bulan_akhir,
         nama_bulan: arrbulan[rt.bulan_akhir],
         rt_persen:rt.persen,
         ex_persen: realpersen,
         rt_jumlah:rt.jumlah,
         ex_jumlah:realjumlah
       });
       
 
 
     })
     arrsubAtivitas.push({
       //key:sak.key,
       kode_aktivitas: ak.key,
       nama_aktivitas:ak.nama_aktivitas,
       alokasi_aktivitas:ak.alokasi_aktivitas,
       kode_aktifitas_sub:sak.key,
       nama_aktivitas_sub:sak.nama_aktivitas_sub,
       BAS:sak.BAS,
       alokasi_aktivitas_sub:sak.alokasi_aktivitas_sub,
       //rencanaTarget :arrrencanatarget,
       realisasi:arrrealisasi
     })
   })
 
  
  });
 

 return jsonFormat(res, "success", "data tampil", arrsubAtivitas);
 }

 exports.ujicoba = async(req,res,next) => {
  try { 
    const data = fs.readFileSync('./src/pdf/SPP/expsippp_ MSQGWswuHMdfzX3VqoNzLZCxAkD4O0YY4ObOZ7tTzNB9krJiy8j7Vewx6nIw0a1K53Zp2JdNf6nf9h3o74kS6rgYjZw8pL429vp.pdf', "utf8")
    
   
    const pdf = data.toString('base64'); //PDF WORKS

    const datan = []
    datan.push({
      "asal_dokumen": "expenditure",
      "script64pdf":pdf
    }) 
    jsonFormat(res, "success", "data tampil", datan);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
 }



 exports.postpdflama = async(req,res,next) => {
  
  const pdf =(
    req.body.scriptHtml
);

const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox"],headless : true})
const page = await browser.newPage()

 await page.setContent(pdf)

 const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let randomchar = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 99; i++ ) {
        randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

const buffer = await page.pdf({
        path : './src/pdf/expsipp_'+randomchar+'.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px'
        }
    })
    await browser.close();
    try { 
      jsonFormat(res, "success", "ulululu", randomchar+'.pdf');
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
}

exports.postpdf = async(req,res,next) => {
 
  const pdf =(
    req.body.scriptHtml
);

const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox"],headless : true})
const page = await browser.newPage()

 await page.setContent(pdf)

 const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let randomchar = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 10; i++ ) {
        randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const folderpath = "./src/pdf/"+req.body.foldername
    fs.mkdir(folderpath,function(e){
  });

const buffer = await page.pdf({
        path : folderpath+'/expsippp_'+randomchar+'.pdf',
        // paperWidth:21.6,
        // paperHeight:35.6,
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

    try { 
      jsonFormat(res, "success", "Berhasil berhasil Horeee",req.body.foldername+'/expsippp_'+randomchar+'.pdf');
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
}



exports.kirimkepanutan = async (req,res,next) =>{
  let body =  {email:"expenditure@ecampus.ut.ac.id",
  password:"password123"}
  const gettoken = await axios .post(`https://pevita.ut.ac.id/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`);

  const token = gettoken.data["access_token"];
  
  const getNomor = await axios .post(`https://pevita.ut.ac.id/utapi/public/api/lat_nosurat`,{
    "aplikasi":"expenditure",
    "sifat_surat":"b",
    "id_surat":14,
    "id_jenis_surat":1,
    "id_jenis_nd":1,
    "perihal":"Uji coba",
    "id_klasifikasi":1,
    "id_sub_unit":75,
    "id_user":12345,
    "nama_pembuat":"rio expend",
    "tanggal":"2022-11-11"
},{ headers: { Authorization: `Bearer ${token}` }})
    
    console.log("cek nomor:",getNomor.data['id_nomor'])
    console.log("cek nomor:",getNomor.data['nomor'])
  try{
    jsonFormat(res, "success", "Berhasil berhasil Horeee",token);
  }catch(error){
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.kirimkepanutan1 = async (req,res,next) =>{
  let body =  {email:"expenditure@ecampus.ut.ac.id",
  password:"password123"}
  const gettoken = await axios .post(`https://pevita.ut.ac.id/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`);

  const token = gettoken.data["access_token"];
  
  const getNomor = await axios .post(`https://pevita.ut.ac.id/utapi/public/api/lat_nosurat`,{
    "aplikasi":"expenditure",
    "sifat_surat":"b",
    "id_surat":14,
    "id_jenis_surat":1,
    "id_jenis_nd":1,
    "perihal":"Uji coba",
    "id_klasifikasi":1,
    "id_sub_unit":75,
    "id_user":12345,
    
    "nama_pembuat":"rio expend",
    "tanggal":"2022-11-11"
},{ headers: { Authorization: `Bearer ${token}` }})
    
    console.log("cek nomor:",getNomor.data['id_nomor'])
    console.log("cek nomor:",getNomor.data['nomor'])
    console.log("cek API getNomor: ",getNomor)

    try{
      jsonFormat(res, "success", "Berhasil berhasil Horeee",getNomor.data);
    }catch(error){
      jsonFormat(res, "failed", error.message, []);
    }
    
  
  }


  exports.kirimkepanutan = async (req,res,next) =>{
    const gettoken = await axios .post(`https://pevita.ut.ac.id/utapi/public/api/login?email=expenditure@ecampus.ut.ac.id&password=password123`);
    const token = gettoken.data["access_token"];    
    let pathpdf = path.join(__dirname,"../public/perjadin","/expereal_1653897873300.pdf");
    let pdfupload = fs.createReadStream(pathpdf);
    let data = new FormData();
  data.append('email', 'expenditure@ecampus.ut.ac.id');
  data.append('password', 'password123');
  data.append('id_aplikasi', '1');
  data.append('id_trx', '10');
  data.append('sifat_surat', 'b');
  data.append('nomor_surat', 'b/14/UN31.UPBJ/TM.00.00/2022');
  data.append('perihal', 'Uji cobaa aja deh');
  data.append('tanggal_surat', '2020-11-10');
  data.append('nip_penandatangan', '199706032021TKT1311');
  data.append('email_penandatangan', 'unitexpenditure@ecampus.ut.ac.id');
  data.append('pdf', pdfupload);
  
  var config = {
    method: 'post',
    url: `${hostProdevPanutannew}/api/external/send_data`,
    headers: { 
      // Authorization: `Bearer ${token}`, 
      
      ...data.getHeaders()
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    jsonFormat(res, "success", "Berhasil berhasil Horeee",response.data);
  })
  .catch(function (error) {
    jsonFormat(res, "failed", error.message, []);
  });
  }