const {jsonFormat} = require("../utils/jsonFormat")
const renderpdf = require("../utils/renderpdf")
const pevita = require("../utils/pevita")
const axios = require("axios");
const dokumenKirimPanutan = require("../models/trx_dokumen_kirim_ke_panutan");
const hostPevita = process.env.hostPevita;
const idAPI = require("../lang/id-api.json");
const aplikasi = process.env.aplikasi;
const log4js = require("log4js");

exports.multirenderkirimpanutan = async(req, res, next) => {
  try {
    let dokumen = req.body.dokumen;
    for (let i = 0; i < dokumen.length; i++) {
      await renderpdf.renderkirim(
        dokumen[i].scriptHtml,
        dokumen[i].sifat_surat,
        dokumen[i].id_trx,
        dokumen[i].nomor_surat,
        dokumen[i].perihal,
        dokumen[i].tanggal_surat,
        dokumen[i].nip_pembuat,
        dokumen[i].nip_penandatangan,
        dokumen[i].tahun
      );
    }
    jsonFormat(res, "success", "Berhasil, data sedang diproses render", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.renderkirimpanutan = (req, res, next) => {
  try {
    renderpdf.renderkirim(
      req.body.scriptHtml,
      req.body.sifat_surat,
      req.body.id_trx,
      req.body.nomor_surat,
      req.body.perihal,
      req.body.tanggal_surat,
      req.body.nip_pembuat,
      req.body.nip_penandatangan,
      req.body.tahun
    );
    jsonFormat(res, "success", "Berhasil, data sedang diproses render", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.getnomor = async (req, res, next) => {
  try {
    let tokenpevita = await pevita.token();
    pevita.generateNomor(
      req.body.kode_surat,
      req.body.katagori_surat,
      req.body.kode_unit,
      req.body.tahun,
      req.body.type_surat,
      req.body.sifat_surat,
      req.body.id_jenis_surat,
      req.body.id_jenis_nd,
      req.body.perihal,
      req.body.id_klasifikasi,
      req.body.id_sub_unit,
      req.body.id_user,
      req.body.ucr,
      req.body.tanggal,
      tokenpevita,
      1
    );
    jsonFormat(res, "success", "berhasil. silahkan tunggu", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.multigetnomor = async (req, res, next) => {
  try {
    let dataNomor = req.body.dataNomor
    let tokenpevita = await pevita.token();
    for(let i = 0; i < dataNomor.length;i++){
   pevita.generateNomor(
     dataNomor[i].kode_surat,
     dataNomor[i].katagori_surat,
     dataNomor[i].kode_unit,
     dataNomor[i].tahun,
     dataNomor[i].type_surat,
     dataNomor[i].sifat_surat,
     dataNomor[i].id_jenis_surat,
     dataNomor[i].id_jenis_nd,
     dataNomor[i].perihal,
     dataNomor[i].id_klasifikasi,
     dataNomor[i].id_sub_unit,
     dataNomor[i].id_user,
     dataNomor[i].ucr,
     dataNomor[i].tanggal,
     tokenpevita,
     i + 1
   );
    }
 
    jsonFormat(res, "success", "berhasil. silahkan tunggu", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.getnomorlangsung1 = async (req, res, next) => {
  
    let tokenpevita = await pevita.token();
    
     dokumenKirimPanutan
    .max("id_trx")
    .then((maxTrx) => {
                console.log(maxTrx);
      let kode_trx = maxTrx + 1;
      console.log(kode_trx);
      let datanomor = {
        aplikasi: "Expenditure",
        sifat_surat: req.body.sifat_surat,
        id_surat: kode_trx,
        id_jenis_surat: req.body.id_jenis_surat,
        id_jenis_nd: req.body.id_jenis_nd,
        perihal: req.body.perihal,
        id_klasifikasi: req.body.id_klasifikasi,
        id_sub_unit: req.body.id_sub_unit,
        id_user: req.body.id_user,
        nama_pembuat: req.body.ucr,
        tanggal: req.body.tanggal,
      };
       return axios.post(`${hostPevita}${idAPI.pevita.lat_nosurat}`, datanomor, {
          headers: { Authorization: `Bearer ${tokenpevita}` },
        })
        .then((nomor) => {
          console.log(nomor.data)
          let kode_trx = maxTrx + 1;

          let datadokumen = {
            id_trx: kode_trx,
            katagori_surat: req.body.katagori_surat,
            id_surat_tugas: req.body.kode_surat,
            kode_unit: req.body.kode_unit,
            tahun: req.body.tahun,
            tanggal: req.body.tanggal,
            jenis_surat: req.body.type_surat,
            id_nomor: nomor.data?.id_nomor,
            nomor: nomor.data?.nomor,
            aktif: 1,
          };
           return dokumenKirimPanutan.create(datadokumen).then((createa) => {
            console.log(createa);
            jsonFormat(res, "success", "Berhasil", createa);
          });
        });
    })
    .catch((err) => {
jsonFormat(res,"failed",err.message,[])
    });
};


exports.getnomorlangsung = async (req, res, next) =>{
  try{
let tokenpevita = await pevita.token();
console.log(tokenpevita);
let maxTRX = await dokumenKirimPanutan.max("id_trx");
let kode_trx = maxTRX+1
 let datanomor = {
   aplikasi: "Expenditure",
   sifat_surat: req.body.sifat_surat,
   id_surat: kode_trx,
   id_jenis_surat: req.body.id_jenis_surat,
   id_jenis_nd: req.body.id_jenis_nd,
   perihal: req.body.perihal,
   id_klasifikasi: req.body.id_klasifikasi,
   id_sub_unit: req.body.id_sub_unit,
   id_user: req.body.id_user,
   nama_pembuat: req.body.ucr,
   tanggal: req.body.tanggal,
 };
 console.log(datanomor)
 
let nomor = await axios.post(`${hostPevita}${idAPI.pevita.lat_nosurat}`, datanomor, {
   headers: { Authorization: `Bearer ${tokenpevita}` },
 }).catch((err)=>{throw err});

  let datadokumen = {
    id_trx: kode_trx,
    katagori_surat: req.body.katagori_surat,
    id_surat_tugas: req.body.kode_surat,
    kode_unit: req.body.kode_unit,
    tahun: req.body.tahun,
    tanggal: req.body.tanggal,
    jenis_surat: req.body.type_surat,
    id_nomor: nomor.data?.id_nomor,
    nomor: nomor.data?.nomor,
    aktif: 1,
  };

  let create = await dokumenKirimPanutan.create(datadokumen);

   jsonFormat(res, "success", "Berhasil", create);

  }catch(err){
    jsonFormat(res,"failed",err.message,[])
  }
}