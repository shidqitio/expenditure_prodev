const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const request = require("request");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const Status = require("../models/ref_status");
const verifikasiSurat = require("../models/trx_verifikasi_surat");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");
const db = require("../config/database");
const { QueryTypes,Op,fn,col } = require("sequelize");
const fs = require('fs');
//const fsPromise = require('fs/promises');
const puppeteer  = require("puppeteer");
const path = require("path");
const https = require('https');
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostPevita = process.env.hostPevita
const generate = require("../utils/generate");
const idAPI = require("../lang/id-api.json")

exports.nested = async (req,res,next) =>{

}

exports.listverifikasi = async (req,res,next) =>{
  try{
  const stpData = await SuratTugasPerjadin.findAll({where:{kode_status:{[Op.in]:[3,4,5]}}})

  const arridsurat = stpData.map((ds) => ds.id_surat_tugas)
  if(arridsurat.length === 0){
    return jsonFormat(res, "failed", "data tidak ada", []);
  }
  console.log(stpData);
  const dokumen = await dokumenKirimPanutan.findAll({where:{katagori_surat:req.params.katagori_surat,jenis_surat:{[Op.in]:['SPP','NOMINATIF','SPTB']},tahun:req.params.tahun,
  id_surat_tugas:{[Op.in]:arridsurat},aktif:{[Op.in]:[1,2]} }});
  const arrdok = dokumen.map((d) => d.id_trx);
  const ttdpanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
  .catch((err)=>{return new Error('Error API Panutan')});
  const datattdpanutan = ttdpanutan.data.data;
  const perjadinttd = datattdpanutan
  //.filter((dt) => dt.perihal === "Perjadin"  );
  const arrpan = perjadinttd.map((dp) => dp.id_trx);
  let arrpush = ['0'];
  
  for(let a = 0;a<arrdok.length;a++){
      if(arrpan.includes(arrdok[a])){
        arrpush.push(arrdok[a])
      }
  }

  const udahditte = await dokumenKirimPanutan.findAll({
    group:['id_surat_tugas'],
    attributes: ['id_surat_tugas', [fn('count', col('id_trx')), 'approve']],
    where:{id_trx:{[Op.in]:arrpush},aktif:{[Op.in]:[1,2]}}
  }).catch(()=>{return new Error('Surat Tugas Tidak dapat diolah')})

  const filter3TTE = udahditte.filter((udt)=>udt.approve===3);
  
//  const filter3TTE = udahditte.filter((udt)=>udt.id_surat_tugas===139);
  const arr3tte = udahditte.map((tte)=>tte.id_surat_tugas);

  const suratverifikasi = await SuratTugasPerjadin.findAll({
    where:{id_surat_tugas:{[Op.in]:arr3tte},data_pengusulan : "TRANSAKSI-BARU"},  include:[{
      model:Status,
      as:"status"
    }]
  }).catch(()=>{return new Error('Surat Tugas Tidak dapat diolah')})

let suratudahtte  = []
  console.log('suratverifikasi:',suratverifikasi)
  //console.log('udah ditte:',udahditte)
suratverifikasi.map((sp)=>{
  let status_approve = [];
  udahditte.map((se)=>{
    if(sp.id_surat_tugas+'' === se.id_surat_tugas){
      status_approve.push(se)
    }
    
  })
  suratudahtte.push(
    {
    id_surat_tugas:sp.id_surat_tugas,
    kode_rka:sp.kode_rka,
    kode_skema_perjadin: sp.kode_skema,
    nama_skema_perjadin: sp.nama_skema_perjadin,
    kode_unit:sp.kode_unit,
    nomor_surat_tugas:sp.nomor_surat_tugas,
    tanggal_surat_tugas:sp.tanggal_surat_tugas,
    status:sp.status,
    status_approve_surat:status_approve

    }
  )
})


  
    jsonFormat(res, "success", "Berhasil menambahkan data", suratudahtte);
      } catch (error) {
        jsonFormat(res, "failed", error, []);
      }


}

exports.listverifikasisptd = async (req,res,next) =>{
  try{
  const stpData = await SuratTugasPerjadin.findAll({where:{kode_status:{[Op.in]:[5,6,7]}}})

  const arridsurat = stpData.map((ds) => ds.id_surat_tugas)
  if(arridsurat.length === 0){
    return jsonFormat(res, "failed", "data tidak ada di kode status 5,6,7", []);
  }

  const dokumen = await dokumenKirimPanutan.findAll({where:{katagori_surat:req.params.katagori_surat,jenis_surat:{[Op.in]:['SPM']},tahun:req.params.tahun,
  id_surat_tugas:{[Op.in]:arridsurat},aktif:{[Op.in]:[1,2]} }});
  const arrdok = dokumen.map((d) => d.id_trx);
  console.log("dokumen:",dokumen);
  if(arrdok.length === 0){
    return jsonFormat(res, "failed", "data tidak ada yang SPM", []);
  }
  const ttdpanutan = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
  .catch(()=>{return new Error('Api Panutan Tidak bisa diakses')});
  const datattdpanutan = ttdpanutan.data.data;
  //const perjadinttd = datattdpanutan.filter((dt) => dt.perihal === req.params.katagori_surat  );
  const arrpan = datattdpanutan.map((dp) => dp.id_trx);
  if(arrpan.length === 0){
    return jsonFormat(res, "failed", "data tidak ada dari panutan", []);
  }
  let arrpush = ['0'];
  
  for(let a = 0;a<arrdok.length;a++){
      if(arrpan.includes(arrdok[a])){
        arrpush.push(arrdok[a])
      }
  }

  const udahditte = await dokumenKirimPanutan.findAll({
    attributes: ['id_surat_tugas'],
    where:{id_trx:{[Op.in]:arrpush},aktif:1}
  })

  
//  const filter3TTE = udahditte.filter((udt)=>udt.id_surat_tugas===139);
 // console.log("cek surat yg 3 kali tte:",filter3TTE);
  const arr3tte = udahditte.map((tte)=>tte.id_surat_tugas);
  
  const suratverifikasi = await SuratTugasPerjadin.findAll({
    where:{id_surat_tugas:{[Op.in]:arr3tte}}, include:[{
      model:Status,
      as:"status"
    }]
  })
  if(suratverifikasi.length === 0){
    return jsonFormat(res, "failed", "data tidak ada yang cocok di database", []);
  }
    jsonFormat(res, "success", "Berhasil menambahkan data", suratverifikasi);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
}



exports.getnomor = async (req,res,next) =>{
  try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return jsonFormat(res, "failed", "validation failede", errors);
    }
    
    const gettoken = await axios .post(`${hostPevita}${idAPI.pevita.login}`)
    .catch(function(error){
     jsonFormat(res, "failed", error.message, []);})
    const token = gettoken.data["access_token"];
     

    
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
    for(let i=0;i<surat.length;i++){  
    let sifat_surat = datasurat.surat[i].sifat_surat;
    let katagori_surat = datasurat.surat[i].katagori_surat;
    let id_jenis_surat = datasurat.surat[i].id_jenis_surat;
    let id_jenis_nd = datasurat.surat[i].id_jenis_nd;
    let perihal = datasurat.surat[i].perihal;
    let id_klasifikasi = datasurat.surat[i].id_klasifikasi;
    let type_surat = datasurat.surat[i].type_surat;
   let getNomor 
    await  axios .post(`${hostPevita}${idAPI.pevita.lat_nosurat}`,{
        "aplikasi":"expenditure",
        "sifat_surat":sifat_surat,
        "id_surat":req.body.id_surat_tugas,
        "id_jenis_surat":id_jenis_surat,
        "id_jenis_nd":id_jenis_nd,
        "perihal":perihal,
        "id_klasifikasi":id_klasifikasi,
        "id_sub_unit":req.body.id_sub_unit,
        "id_user":req.body.id_user,        
        "nama_pembuat":req.body.ucr,
        "tanggal":req.body.tanggal
    },{ headers: { Authorization: `Bearer ${token}` }}).then(function(nomortbl){
      console.log("cek dari peviita")
      arrcek.push(nomortbl.data);
       getNomor = nomortbl;
    }).catch(function (error) {
      throw new Error('nomor surat tidak didapat');
    });

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
    }}).then((a)=>a).catch((err)=>err)

    await dokumenKirimPanutan.create({
      katagori_surat:katagori_surat,
      id_surat_tugas:req.body.id_surat_tugas,
      kode_unit:req.body.kode_unit,
      tahun:req.body.tahun,
      jenis_surat:type_surat,
      id_nomor:id_nomor,
      tanggal:req.body.tanggal,
      nomor:nomor,
      aktif:1
   }).then((a)=>a).catch((err)=>err)

  }
    jsonFormat(res, "success", "Berhasil menambahkan data", arrcek);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
} 

exports.renderdankirim = async (req,res,next) => {
  try{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return jsonFormat(res, "failed", "validation failede", errors);
  }

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
browser,page,buffer,randomchar,charactersLength,folderpath, data;
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
           nip_penandatangan = datadokument.dokumen[i].nip_penandatangan
           email_penandatangan = datadokument.dokumen[i].email_penandatangan
           nip_pembuat = datadokument.dokumen[i].nip_pembuat
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
            let filename = 'expsipppbj_spm_'+randomchar+'.pdf'
            let pathpdf = path.join(
              __dirname,
              "../public/perjadin/",
              "/expsipppper_" + randomchar + ".pdf"
            );
          generate.kirimpanutan(pathpdf,filename,sifat_surat,id_trx,nomor_surat,perihal,tanggal_surat,nip_pembuat,nip_penandatangan,req.body.tahun)
            
          }
            
            


              jsonFormat(res, "success", "berhasil mengajukan dokumen", datadokument);
            }
            catch(error){jsonFormat(res, "failed", error.message, error);}

  
}

exports.listverifikasibykodeunit = async (req, res, next) => {
  try {
    const stpData = await SuratTugasPerjadin.findAll({
      where: { kode_status: { [Op.in]: [3, 4, 5] } },
    });

    const arridsurat = stpData.map((ds) => ds.id_surat_tugas);
    if (arridsurat.length === 0) {
      return jsonFormat(res, "failed", "data tidak ada", []);
    }
    const dokumen = await dokumenKirimPanutan.findAll({
      where: {
        katagori_surat: req.params.katagori_surat,
        jenis_surat: { [Op.in]: ["SPP", "NOMINATIF", "SPTB"] },
        tahun: req.params.tahun,
        id_surat_tugas: { [Op.in]: arridsurat },
        aktif: { [Op.in]: [1, 2] },
      },
    });
    const arrdok = dokumen.map((d) => d.id_trx);
    const ttdpanutan = await axios
      .get(`${hostProdevPanutannew}${idAPI.panutan.data_apl_external}`)
      .catch((err) => {
        return new Error("Error API Panutan");
      });
    const datattdpanutan = ttdpanutan.data.data;
    const perjadinttd = datattdpanutan;
    //.filter((dt) => dt.perihal === "Perjadin"  );
    const arrpan = perjadinttd.map((dp) => dp.id_trx);
    let arrpush = ["0"];

    for (let a = 0; a < arrdok.length; a++) {
      if (arrpan.includes(arrdok[a])) {
        arrpush.push(arrdok[a]);
      }
    }

    const udahditte = await dokumenKirimPanutan
      .findAll({
        group: ["id_surat_tugas"],
        attributes: ["id_surat_tugas", [fn("count", col("id_trx")), "approve"]],
        where: { id_trx: { [Op.in]: arrpush }, aktif: { [Op.in]: [1, 2] } },
      })
      .catch(() => {
        return new Error("Surat Tugas Tidak dapat diolah");
      });

    const filter3TTE = udahditte.filter((udt) => udt.approve === 3);

    //  const filter3TTE = udahditte.filter((udt)=>udt.id_surat_tugas===139);
    const arr3tte = udahditte.map((tte) => tte.id_surat_tugas);

    const suratverifikasi = await SuratTugasPerjadin.findAll({
      where: {
        id_surat_tugas: { [Op.in]: arr3tte },
        kode_unit: req.params.kode_unit,
        data_pengusulan: "TRANSAKSI-BARU",
      },
      include: [
        {
          model: Status,
          as: "status",
        },
      ],
    }).catch(() => {
      return new Error("Surat Tugas Tidak dapat diolah");
    });

    let suratudahtte = [];
    console.log("suratverifikasi:", suratverifikasi);
    //console.log('udah ditte:',udahditte)
    suratverifikasi.map((sp) => {
      let status_approve = [];
      udahditte.map((se) => {
        if (sp.id_surat_tugas + "" === se.id_surat_tugas) {
          status_approve.push(se);
        }
      });
      suratudahtte.push({
        id_surat_tugas: sp.id_surat_tugas,
        kode_rka: sp.kode_rka,
        kode_skema_perjadin: sp.kode_skema,
        nama_skema_perjadin: sp.nama_skema_perjadin,
        kode_unit: sp.kode_unit,
        nomor_surat_tugas: sp.nomor_surat_tugas,
        tanggal_surat_tugas: sp.tanggal_surat_tugas,
        status: sp.status,
        status_approve_surat: status_approve,
      });
    });

    jsonFormat(res, "success", "Berhasil menambahkan data", suratudahtte);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

// exports.renderdankirim = async (req,res,next) => {
//   try{
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return jsonFormat(res, "failed", "validation failede", errors);
//   }

//   let dokumen = req.body.dokumen
   
//   let datadokument = {
//     'dokumen':req.body.dokumen,
//     'scriptHtml':req.body.scriptHtml,
//     'id_jenis_surat':req.body.id_jenis_surat,
//     'id_jenis_nd':req.body.id_jenis_nd,
//     'perihal':req.body.perihal,
//     'id_klasifikasi':req.body.id_klasifikasi , 
//     'id_trx':req.body.id_trx,
//     'sifat_surat':req.body.sifat_surat,
//     'id_nomor':req.body.id_nomor,
//     'jenis_surat':req.body.jenis_surat,
//     'nomor_surat':req.body.nomor_surat,
//     'perihal':req.body.perihal,
//     'tanggal_surat':req.body.tanggal_surat,
//     'nip_penandatangan':req.body.nip_penandatangan,
//     'email_penandatangan':req.body.email_penandatangan,
//   }


//   const gettoken = await axios .post(`${hostPevita}${idAPI.pevita.login}`).catch(function(error){
//     jsonFormat(res, "failed", error.message, []);
//   });
//   const token = gettoken.data["access_token"];
 
// let scriptHtml,id_jenis_surat,id_jenis_nd,perihal,id_klasifikasi,id_trx,sifat_surat,nomor_surat,tanggal_surat,nip_penandatangan,email_penandatangan,pdf,
// browser,page,buffer,randomchar,charactersLength,folderpath, data;
// let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// console.log("dokumen length:",dokumen.length)
// let arrresponpanutan = [];
//           for(let i =0; i<dokumen.length;i++){
//             scriptHtml = datadokument.dokumen[i].scriptHtml
//            id_jenis_surat = datadokument.dokumen[i].id_jenis_surat
//            id_jenis_nd = datadokument.dokumen[i].id_jenis_nd
//            perihal = datadokument.dokumen[i].perihal
//            id_klasifikasi = datadokument.dokumen[i].id_klasifikasi
//            id_trx = datadokument.dokumen[i].id_trx
//            sifat_surat = datadokument.dokumen[i].sifat_surat
//            id_nomor = datadokument.dokumen[i].id_nomor
//            nomor_surat = datadokument.dokumen[i].nomor_surat
//            tanggal_surat = datadokument.dokumen[i].tanggal_surat
//            nip_penandatangan = datadokument.dokumen[i].nip_penandatangan
//            email_penandatangan = datadokument.dokumen[i].email_penandatangan
//            nip_pembuat = datadokument.dokumen[i].nip_pembuat
//            //render pdf
//            arrresponpanutan.push(datadokument.dokumen[i])
//              pdf =(
//               scriptHtml
//             );
//            browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
//            page = await browser.newPage()
//           await page.setContent(pdf)
//           randomchar = '';
//               charactersLength = characters.length;
//               for ( let i = 0; i < 15; i++ ) {
//                   randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
//               }
//               folderpath = "./src/public/perjadin"
//               fs.mkdir(folderpath,function(e){
//             });

//           buffer = await page.pdf({
//                   path : folderpath+'/expsipppper_'+randomchar+'.pdf',
//                 // paperWidth:8.5,
//                 // paperHeight:13,
//                 format: 'Legal',
//                   printBackground: true,
//                   margin: {
//                       left: '0px',
//                       top: '0px',
//                       right: '0px',
//                       bottom: '0px'
//                   }
//               })
//               await browser.close();
//             // kirim ke panutan
            
//               let pathpdf = path.join(__dirname,"../public/perjadin/expsipppper_"+randomchar+".pdf");
//               let fileexist = fs.existsSync(pathpdf);
//               console.log("file exist:", fileexist);
//               let pdfupload = fs.createReadStream(pathpdf);
//             data = new FormData();
//             data.append('email', 'expenditure@ecampus.ut.ac.id');
//             data.append('password', 'password123');
//             data.append('id_aplikasi', '4');
//             data.append('id_trx', id_trx);
//             data.append('sifat_surat', sifat_surat);
//             data.append('nomor_surat', nomor_surat);
//             data.append('perihal', perihal);
//             data.append('tanggal_surat', tanggal_surat);
//             data.append('nip_pembuat',nip_pembuat);
//             nip_penandatangan.forEach((item) => data.append("nip_penandatangan[]", item))
//             data.append('email_penandatangan', email_penandatangan);
//             data.append('pdf', pdfupload);

//             var config = {
//               method: 'post',
//               url: `${hostProdevPanutannew}${idAPI.panutan.send_data}`,
//               headers: { 
//                  Authorization: `Bearer ${token}`, 
                
//                 ...data.getHeaders()
//               },
//               data : data
//             };
            
//             let kirimpanutan = await axios(config).then(function (response) {              
//              arrresponpanutan.push(response) 
//              arrresponpanutan.push({"berhasil":"berhasil 123"}) 
//              return response.data
//             }).catch(function (error) {
//              arrresponpanutan.push({"gagal":"gagal"})
//             });
//             fs.unlink(pathpdf, (err) => {console.log("unlink error", err);})
//             let link_file = generate.linkfilepanutan(req.body.tahun,kirimpanutan.id,kirimpanutan.dokumen)
//             await dokumenKirimPanutan.update({link_file:link_file,id_file:kirimpanutan.id},{where:{
//               id_trx:id_trx
//             }}).catch(function (error){
//                 arrresponpanutan.push('error input database')
//             })  
//           }
            
            


//               jsonFormat(res, "success", "berhasil mengajukan dokumen", datadokument);
//             }
//             catch(error){jsonFormat(res, "failed", error.message, error);}

  
// }