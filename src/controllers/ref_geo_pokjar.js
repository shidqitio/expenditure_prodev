const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const Pokjar = require("../models/ref_geo_pokjar");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getAll = async (req, res, next) => {
    try {
      const data = await Pokjar.findAll({include: ['kabko']});
      if(data === null){
        jsonFormat(res, "failed", "Data tidak ditemukan", []);
      }
      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.getbyprimarykey = async (req, res, next) => {
    try {
      const data = await Pokjar.findOne({
        where:{kode_pokjar:req.params.kode_pokjar},
        include: ['kabko']
      });
      if(data === null){
        jsonFormat(res, "failed", "Data tidak ditemukan", []);
      }
      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  
  exports.getbykodekabko = async (req, res, next) => {
    try {
      const data = await Pokjar.findAll({
        where:{kode_kabko:req.params.kode_kabko},
        include: ['kabko']
      });
      if(data === null){
        jsonFormat(res, "failed", "Data tidak ditemukan", []);
      }
      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.getbykodeprovinsi = async (req, res, next) => {
    try {
      const data = await Pokjar.findAll({
        where:{kode_negara:req.params.kode_negara},
        include: ['kabko']
      });
      if(data === null){
        jsonFormat(res, "failed", "Data tidak ditemukan", []);
      }
      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.create = async (req,res,next) => {

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
            dataSplit[3]
        )
    })
    console.log("array pokjar",arrPokjar);
    let arrdatanumber = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99']
    let betterWords = arrdatanumber.filter(function(word) {
        return !arrPokjar.includes(word);
      });
    
    console.log("dataMax",betterWords[0]);
    
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

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await Pokjar.findOne({
        where: { kode_pokjar:req.params.kode_pokjar},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data pokjar tidak ada", []);
  
      await Pokjar.destroy({
        where: {
          kode_pokjar:req.params.kode_pokjar
        },
      });
      jsonFormat(res, "success", "Berhasil menghapus data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };

  exports.update = async (req, res, next) => {
    try {
      const data = await Pokjar.findOne({
        where: { kode_pokjar:req.params.kode_pokjar},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data pokjar tidak ada", []);
  
      await Pokjar.update(req.body, {
        where: {
          kode_pokjar:req.params.kode_pokjar
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };
