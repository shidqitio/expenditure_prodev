const db = require("../../config/database");
const fs = require('fs');
const puppeteer  = require("puppeteer");
const path = require("path");
const https = require('https');
const axios = require("axios");
const dataRefHonor = require("./ref_honorarium_kegiatan_data")
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan");
const SuratTugasHonor = require("../../models/ref_surat_tugas_honor");
const { jsonFormat } = require("../../utils/jsonFormat");
const generate = require("../../utils/generate");
const hostPevita = process.env.hostPevita
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const hostsiakun = process.env.hostSiakun
const hostSiakunBe1 = process.env.hostSiakunBe1
const idAPI = require("../../lang/id-api.json")



const getNomor = async(req,res,next)=>{
  const dokumen = req.body.dokumen
  const tokenAPK = await token()
    try{ 
    const maxDok = await dokumenKirimPanutan.max('id_trx');
      console.log("rioooo masuk");
    let dataBulkCreate = []
    for(let a = 0;a<dokumen.length;a++){
      console.log("rioooo masuk2");
      console.log(a);
      let kode_trx = maxDok+1+a
      let dataPevita = await dataRefHonor.dataGetNomor(req.body,dokumen[a],kode_trx)
       let dataNomor = await axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,dataPevita,
      { headers: { Authorization: `Bearer ${tokenAPK}` }}).then((a)=>{return a.data}).catch((err)=>{
        console.log(err);
        err.statusCode = 400
        return err})
        console.log(dataNomor);
    let dataKondisiUpdate = await dataRefHonor.whereUpdatedokumen(req.body,dokumen[a],dataNomor["id_nomor"],dataNomor["nomor"]) 
    let dataCreate = await  dataRefHonor.dataCreatedokumen(req.body,dokumen[a],kode_trx,dataNomor["id_nomor"],dataNomor["nomor"])
    //let kirimSiakun = await siakun(req.body)
   
    dokumenKirimPanutan.update({aktif:0},{where:dataKondisiUpdate}).then((a)=>{return dokumenKirimPanutan.create(dataCreate)}).catch((err)=> {err.statusCode = 402; throw err})
    dataBulkCreate.push(dataCreate)
    }
    // let dataSiakun = await dataRefHonor.data_siakun(req.body)
    // console.log("a",dataSiakun)
    // let lemparsiakun = await axios .post(`https://be1.ut.ac.id/siakun/apiv1/transaksi-pagu/store`,dataSiakun).then((response)=>{return response.data})
    // .catch((err)=>{throw err})

    let dataSiakun = {
      "tahun":req.body.tahun,
      "kode_aplikasi":"08",
      "kode_menu":"M08.01.04",
      "kode_surat":req.body.id_surat_tugas,
      "kode_sub_surat":"-",
      "tanggal_transaksi":req.body.tanggal,
      "keterangan":`Surat Honorarium - Nomor surat:${req.body.nomor_surat_tugas}`,
      "kode_rkatu":req.body.kode_rkatu,
      "bulan_rkatu":req.body.bulan_rkatu,
      "nominal":req.body.nominal,
      "ucr":req.body.ucr
  }
   await axios .post(`${hostSiakunBe1}${idAPI.siakun.pagu_store}`,dataSiakun).catch(()=>0)
    await updateStatusSK(req.body,3)
      return jsonFormat(res,"success","berhasil mengambil nomor",dataBulkCreate)
    }catch(err){
        err.statusCode = 401
        next(err)
    }
}

const getNomorSPM = async(req,res,next)=>{
  try{
    const tokenAPK = await token()
    const maxDok = await dokumenKirimPanutan.max('id_trx');
    let kode_trx = maxDok+1
    let dataPevita = await dataRefHonor.dataGetNomor(req.body,req.body,kode_trx)
    let dataNomor = await axios .post(`${hostPevita}${idAPI.pevita.lat_surat}`,dataPevita,
    { headers: { Authorization: `Bearer ${tokenAPK}` }}).then((a)=>{return a.data}).catch((err)=>{
      err.statusCode = 401
      throw err})
      let dataKondisiUpdate = dataRefHonor.whereUpdatedokumen(req.body,req.body,dataNomor["id_nomor"],dataNomor["nomor"]) 
      let dataCreate = dataRefHonor.dataCreatedokumen(req.body,req.body,kode_trx,dataNomor["id_nomor"],dataNomor["nomor"])
      dokumenKirimPanutan.update({aktif:0},{where:dataKondisiUpdate}).then((a)=>{return a}).catch((err)=> {err.statusCode = 402; throw err})
      let create = await dokumenKirimPanutan.create(dataCreate)
      await updateStatusSK(req.body,5)
      jsonFormat(res,"success","berhasil membuat nomor",create)
  }catch(err){
    err.statusCode = 402
    next(err)
  }
}

const renderKirim = async(req,res,next)=>{
  let dokumen = req.body.dokumen
  let folderpath = `./src/public/honorarium/${req.body.nama_honor}`
  let namadepan = "/expsipppp_"
  let jenis_file = ".pdf"
  let tokenAPK = await token()
  try{
    let dokumenPanutans = []
      for(let i = 0;i<dokumen.length;i++){
        let randomchars = dataRefHonor.randomchar(15,'all')
        let renderFile = await render(dokumen[i].scriptHtml,folderpath,namadepan,randomchars,jenis_file)
        let dokumenPanutan = await kirim(dokumen[i],req.body.nama_honor,namadepan,randomchars,jenis_file,req.body.tahun,tokenAPK)
        dokumenPanutans.push(dokumenPanutan)
        let link_file = generate.linkfilepanutan(req.body.tahun,dokumenPanutan.id,dokumenPanutan.dokumen)
        dokumenKirimPanutan.update({link_file:link_file,id_file:dokumenPanutan.id},{where:{
          id_trx:dokumen[i].id_trx
        }}).then((a)=>{return a}).catch((err)=>{err.statusCode == 403; throw err})
      }

    jsonFormat(res,"success","Berhasil mengirim data",dokumenPanutans)
  }catch(err){
    next(err)
  }
}

const renderKirimSPM = async(req,res,next)=>{
  try{
    let dokumen = req.body
    let folderpath = `./src/public/honorarium/${req.body.nama_honor}`
    let namadepan = "/expsipppp_"
    let jenis_file = ".pdf"
    let tokenAPK = await token()
    let randomchars = dataRefHonor.randomchar(15,'all')
    let rendera = await render(req.body.scriptHtml,folderpath,namadepan,randomchars,jenis_file)
     let dokumenPanutan = await kirim(req.body,req.body.nama_honor,namadepan,randomchars,jenis_file,req.body.tahun,tokenAPK)
    let link_file = generate.linkfilepanutan(req.body.tahun,dokumenPanutan.id,dokumenPanutan.dokumen)
    let updateDokumen = await dokumenKirimPanutan.update({link_file:link_file,id_file:dokumenPanutan.id},{where:{
          id_trx:dokumen.id_trx
        }}).then((a)=>{return a}).catch((err)=>{err.statusCode == 403; throw err})
  jsonFormat(res,"success","Berhasil mengirim data",dokumenPanutan)
  }catch(err){
    next(err)
  }
}

let token = async()=>{
  return await axios .post(`${hostPevita}${idAPI.pevita.login}`)
  .then((a)=>{return a.data["access_token"]})
}

let render = async(scriptHtml,folderpath,namadepan,randomchar,jenis_file) =>{
      let pdf,browser,page,buffer
      pdf = (scriptHtml);
      browser = await puppeteer.launch({ args: ["--no-sandbox", "--disabled-setupid-sandbox","--use-gl=egl"],headless : true})
      page = await browser.newPage()
      await page.setContent(pdf)
      fs.mkdir(folderpath,function(e){});
      buffer = await page.pdf({
        path : folderpath+namadepan+randomchar+jenis_file,
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
}

let kirim = async(dokumen,nama_honor,namadepan,randomchar,jenis_file,tahun,tokenAPK) =>{
  let filename = namadepan + randomchar + jenis_file;
  let pathpdf = path.join(__dirname,"../../public/honorarium/"+nama_honor,filename);
  
  generate.kirimpanutan(pathpdf,filename,"b",dokumen.id_trx,dokumen.nomor_surat,dokumen.perihal,dokumen.tanggal_surat,dokumen.nip_pembuat,dokumen.nip_penandatangan,tahun)
// pathpdf,
//   filename,
//   sifat_surat,
//   id_trx,
//   nomor_surat,
//   perihal,
//   tanggal_surat,
//   nip_pembuat,
//   nip_penandatangan,
//   tahun;
  //   console.log(pathpdf)
//   console.log(fileexist)
//   let pdfupload = fs.createReadStream(pathpdf);
//   data = dataRefHonor.dataKirimPanutan(dokumen,pdfupload);
//   var config = {
//   method: 'post',
//   url: `${hostProdevPanutannew}${idAPI.panutan.send_data}`,
//   headers: { 
//      Authorization: `Bearer ${tokenAPK}`, 
    
//     ...data.getHeaders()
//   },
//   data : data
// };
// let response = await axios(config).then((a)=>{return a.data})
// fs.unlink(pathpdf, (err) => {console.log("unlink error", err);})
// return response
return null
}

let siakun = async(data)=>{
  let lemparsiakun = await axios .post(`${hostSiakunBe1}${idAPI.siakun.pagu_store}`,{
    "tahun":data.tahun,
    "aplikasi":"E-Expenditure",
    "modul":data.modul,
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

let updateStatusSK = async(data,status)=>{
  let response = await SuratTugasHonor.update({kode_status:status},{where:{kode_surat:data.id_surat_tugas,tahun:data.tahun}})
  return response
}

module.exports = {
  render,
  kirim,
  getNomor,
  getNomorSPM,
  renderKirim,
  renderKirimSPM
}