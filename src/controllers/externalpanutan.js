const axios = require("axios");
const { jsonFormat } = require("../utils/jsonFormat");
const Pokjar = require("../models/ref_geo_pokjar");
const Kabko = require("../models/ref_geo_kabko");
const Provinsi = require("../models/ref_geo_provinsi");
const SbmTransport = require("../models/ref_sbm_transport");
const { validationResult } = require("express-validator");
const hostProdevPanutannew = process.env.hostProdevPanutannew

exports.getAll = async (req, res, next) => {
    try {
        const cekpokjar = await pokjar.findAll();
    
        if (cekpokjar.length === 0)
          return jsonFormat(res, "failed", "kode pokjar tidak ada", []);
    
        jsonFormat(res, "success", "Berhasil memuat data", cekpokjar);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    };

    exports.filtersatu = async (req, res, next) => {
      try {
        const data = await SbmTransport.findAll({
          where:{kode_unit:req.params.kode_unit},
          include:["provinsi_asal","pokjar_asal"]
        ,group:"asal"});
        jsonFormat(res, "success", "Berhasil memuat data", data);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }
  
    exports.filterdua = async (req, res, next) => {
      try {
        const data = await SbmTransport.findAll({
          where:{kode_unit:req.params.kode_unit, asal:req.params.asal},
          include:["provinsi_tujuan","pokjar_tujuan"],
          group:"tujuan"});
        //jsonFormat(res, "success", "Berhasil memuat data", data);
        res.json(data)
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }

    exports.filtergabungan = async (req, res, next) => {
      try {
        const data = await SbmTransport.findAll({attributes: {exclude: ['udara','darat','laut']},
          where:{kode_unit:req.params.kode_unit},
          
          include:["provinsi_asal","pokjar_asal","provinsi_tujuan","pokjar_tujuan"]});
        jsonFormat(res, "success", "Berhasil memuat data", data);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }
    
    exports.pokjargetbykodekabko = async (req, res, next) => {
      try {
        const data = await Pokjar.findAll({
          where:{kode_kabko:req.params.kode_kabko}
        });
        if(data === null){
         return jsonFormat(res, "failed", "Data tidak ditemukan", []);
        }
        jsonFormat(res, "success", "Berhasil memuat data  ", data);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }


    exports.kabkogetbykodeprovinsi = async (req, res, next) => {
      try {
        const data = await Kabko.findAll({
          where:{kode_provinsi:req.params.kode_provinsi},
          include: ['provinsi']
        });
        if(data === null){
          jsonFormat(res, "failed", "Data tidak ditemukan", []);
        }
  
        jsonFormat(res, "success", "Berhasil memuat data irgi", data);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }

    exports.provinsigetbykodenegara = async (req, res, next) => {
      
      try {
        const data = await Provinsi.findAll({
          where:{kode_negara:req.params.kode_negara},
          include: 'negara'
        });
        jsonFormat(res, "success", "Berhasil memuat data", data);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    }

    exports.createsbmpanutan = async (req,res,next) => {
    
      const data = await SbmTransport.findAll({where:{kode_unit:req.body.kode_unit,asal:req.body.asal,tujuan:req.body.tujuan}});
      if(data.lenght > 0){
        return jsonFormat(res, "failed","data telah ada di database", []);
      }
      try{
        await SbmTransport.create({
          kode_unit:req.body.kode_unit,
          kode_provinsi_asal:req.body.kode_provinsi_asal,
          asal:req.body.asal,
          tujuan:req.body.tujuan,
          kode_provinsi_tujuan:req.body.kode_provinsi_tujuan,
          keterangan:"pengajuan data sbm baru",
          ucr: req.body.ucr,
        })
        jsonFormat(res, "success", "Berhasil membuat data", []);
      }catch(error){
        jsonFormat(res, "failed", error.message, []);}
    }

    exports.createprovinsipanutan = async (req,res,next) => {
      try{
      const data = await Provinsi.findAll({where:{kode_provinsi:req.body.kode_provinsi}});
      if(data.lenght > 0){
        return jsonFormat(res, "failed","data telah ada di database", []);
      }
        await Provinsi.create({
          kode_negara:req.body.kode_negara,
          kode_provinsi:req.body.kode_provinsi,
          nama_provinsi:req.body.nama_provinsi,
          ibukota_provinsi:req.body.ibukota_provinsi,
          ucr: req.body.ucr,
        })
        jsonFormat(res, "success", "Berhasil membuat data", []);
      }catch(error){
        jsonFormat(res, "failed", error.message, []);}
    }

    exports.createkabkopanutan = async (req,res,next) => {
      try{
      const data = await Kabko.findOne({where:{nama_kabko:req.body.nama_kabko}});
      if(data !== null){
        return jsonFormat(res, "failed","data telah ada di database", []);
      }
      const dataKabko = await Kabko.findAll({where:{kode_provinsi:req.body.kode_provinsi}});
      let arrkabko = []
      dataKabko.map((k)=>{
          let kk = k.kode_kabko;
          let dataSplit = kk.split(".")
          arrkabko.push(
              dataSplit[1]
          )
      })
      let arrdatanumber = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99']
      let betterWords = arrdatanumber.filter(function(word) {
          return !arrkabko.includes(word);
        });
        await Kabko.create({
          kode_provinsi:req.body.kode_provinsi,
          kode_kabko:req.body.kode_provinsi+"."+betterWords[0],
          nama_kabko:req.body.nama_kabko,
          pusat_kabko:req.body.pusat_kabko,
          ucr: req.body.ucr,
        })
        jsonFormat(res, "success", "Berhasil membuat data", []);
      }catch(error){
        jsonFormat(res, "failed", error.message, []);}
    }

    exports.createpokjarpanutan = async (req,res,next) => {

      try{
      const data = await Pokjar.findOne({where:{nama_pokjar:req.body.nama_pokjar}});
      if(data !== null){
        return jsonFormat(res, "failed","data telah ada di database", []);
      }
      const dataPokjar = await Pokjar.findAll({where:{kode_kabko:req.body.kode_kabko}});
      let arrPokjar = []
      dataPokjar.map((k)=>{
          let kk = k.kode_pokjar;
          let dataSplit = kk.split(".")
          arrPokjar.push(
              dataSplit[2]
          )
      })
      let arrdatanumber = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99']
      let betterWords = arrdatanumber.filter(function(word) {
          return !arrPokjar.includes(word);
        });
      
      
        await Pokjar.create({
          kode_kabko: req.body.kode_kabko,
          kode_pokjar:req.body.kode_kabko+"."+betterWords[0],
          nama_pokjar:req.body.nama_pokjar,
          ucr: req.body.ucr,
        })
        jsonFormat(res, "success", "Berhasil membuat data", []);
      }catch(error){
        jsonFormat(res, "failed", error.message, []);}
    }

exports.jenis_surat = async(req,res,next) =>{

  const datapanutan = await axios .get(`${hostProdevPanutannew}/api/external/get_jenis_surat`).then((data)=>{
    return data.data
  })

  let arrSatu = []
  datapanutan.map((dp)=>{
    if(!arrSatu.includes(
      {"id_jenis_nd":dp.id_jenis_nd,
    "nama_jenis_nd":dp.nama_jenis_nd}))
    {
      arrSatu.push({"id_jenis_nd":dp.id_jenis_nd,
      "nama_jenis_nd":dp.nama_jenis_nd})
    }
  }
  )
 let arrOutput = []
  arrSatu.map((as)=>{
    let arrChild = []
    
    datapanutan.map((dpan)=>{
      if(as.id_jenis_nd === dpan.id_jenis_nd){
        arrChild.push({"id_jenis_nd":dpan.id_jenis_nd,
        "id_jenis_surat":dpan.id_jenis_surat,
        "nama_jenis_surat":dpan.nama_jenis_surat
      })
      }
    })
    
    arrOutput.push({
      "id_jenis_nd":as.id_jenis_nd,
      "nama_jenis_nd":as.nama_jenis_nd,
      "jenis_surat":arrChild
    })
  })

  try{
    jsonFormat(res, "success", "Berhasil menampilkan data", arrOutput);
  }catch(error){
    jsonFormat(res, "failed", error.message, []);
  }

}
