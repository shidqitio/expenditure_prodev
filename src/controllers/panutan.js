const axios = require("axios");
const { jsonFormat } = require("../utils/jsonFormat");
const request = require("request");
const hostProdevPanutan = process.env.hostProdevPanutan
const hostProdevPanutannew = process.env.hostProdevPanutannew
const idAPI = require("../lang/id-api.json")

exports.getUnit = async (req, res, next) => {
  await axios
    .get(`${hostProdevPanutannew}${idAPI.panutan.get_unit}`)
    .then((r) => {
      jsonFormat(res, "success", "Berhasil menampilkan data", r.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUnitbyId = async (req, res, next) => {
  try { 
  const datap = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.get_unit}`);
 const pdata = datap.data;
 //console.log("cek pdata",pdata);
   let arrunit = [];
   let pdatafilter = pdata.filter((p) => p.id_sub_unit == req.params.id)[0]
   //console.log("cek filter", pdatafilter.nama_unit);
   if(arrunit.length === 0){
    throw new Error("data unit tidak ada")
   }
      arrunit.push({
        id_sub_unit: pdatafilter.id_sub_unit,
        nama_unit: pdatafilter.nama_unit,
        kode_unit: pdatafilter.kode_unit})   
     

      jsonFormat(res, "success", "sukses menampilkan data", arrunit);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
};


exports.getUnitbykodeunit = async (req, res, next) => {
  try { 
  const datap = await axios .get(`${hostProdevPanutannew}${idAPI.panutan.get_unit}`);
  const pdata = datap.data;
  //console.log("cek pdata",pdata);
    let arrunit = [];
    let pdatafilter = pdata.filter((p) => p.kode_unit == req.params.id)[0]
    //console.log("cek filter", pdatafilter.nama_unit);
    
       arrunit.push({
         id_sub_unit: pdatafilter.id_sub_unit,
         nama_unit: pdatafilter.nama_unit,
         kode_unit: pdatafilter.kode_unit})   
      
 
     
       jsonFormat(res, "success", "sukses menampilkan data", arrunit);
     } catch (error) {
       jsonFormat(res, "failed", error.message, []);
     }
 };

exports.getSuratTugasByUnit = async (req, res, next) => {
  await axios
    .get(
      `${hostProdevPanutannew}${idAPI.panutan.surtug_perjadin}/${req.params.id}`
    )
    .then((r) => {
      jsonFormat(res, "success", "Berhasil menampilkan data", r.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPetugasByNomorSurat = async (req, res, next) => {
  await axios
    .get(
      `${hostProdevPanutannew}${idAPI.panutan.petugas_perjadin}/${req.params.id}`
    )
    .then((r) => {
      jsonFormat(res, "success", "Berhasil menampilkan data", r.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSuratTugasById = async (req, res, next) => {
  
  await axios
    .get(
      `${hostProdevPanutannew}${idAPI.panutan.detail_perjadin}/${req.params.id}`
    )
    .then((r) => {
      jsonFormat(res, "success", "Berhasil menampilkan data", r.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

