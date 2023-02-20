const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const Kabko = require("../models/ref_geo_kabko");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getAll = async (req, res, next) => {
    try {
      const data = await Kabko.findAll({include: ['provinsi']});
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
      const data = await Kabko.findOne({
        where:{kode_kabko:req.params.kode_kabko},
        include: ['provinsi']
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
      const data = await Kabko.findAll({
        where:{kode_provinsi:req.params.kode_provinsi},
        include: ['provinsi']
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
            dataSplit[2]
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

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await Kabko.findOne({
        where: { kode_kabko:req.params.kode_kabko},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data Kabko tidak ada", []);
  
      await Kabko.destroy({
        where: {
          kode_kabko:req.params.kode_kabko
        },
      });
      jsonFormat(res, "success", "Berhasil menghapus data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };

  exports.update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return jsonFormat(res, "failed", "validation failed", errors);
  }
    try {
      const data = await Kabko.findOne({
        where: { kode_kabko:req.params.kode_kabko},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data Kabko tidak ada", []);
  
      await Kabko.update(req.body, {
        where: {
          kode_kabko:req.params.kode_kabko
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };
