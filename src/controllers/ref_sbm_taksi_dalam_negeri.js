const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const SbmTaksi = require("../models/ref_sbm_taksi");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getAll = async (req, res, next) => {
    try {
      const data = await SbmTaksi.findAll({include: ['provinsi']});
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
      const data = await SbmTaksi.findOne({
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

  

  exports.getbykodeprovinsi = async (req, res, next) => {
    try {
      const data = await SbmTaksi.findAll({
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
    const data = await SbmTaksi.findOne({where:{kode_provinsi:req.body.kode_provinsi}});
    if(data !== null){
      return jsonFormat(res, "failed","data telah ada di database", []);
    }
      await SbmTaksi.create({
        kode_provinsi:req.body.kode_provinsi,
        nomor_sk_sbm:req.body.nomor_sk_sbm,
        kode_katagori_sbm:req.body.kode_katagori_sbm,
        satuan:req.body.satuan,
        biaya: req.body.biaya,
        ucr:req.body.ucr
      })
      jsonFormat(res, "success", "Berhasil membuat data", []);
    }catch(error){
      jsonFormat(res, "failed", error.message, []);}
  }

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await SbmTaksi.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data SbmTaksi tidak ada", []);
  
      await SbmTaksi.destroy({
        where: {
          kode_provinsi:req.params.kode_provinsi
        },
      });
      jsonFormat(res, "success", "Berhasil menghapus data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };

  exports.update = async (req, res, next) => {
    try {
      const data = await SbmTaksi.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data SbmTaksi tidak ada", []);
  
      await SbmTaksi.update(req.body, {
        where: {
          kode_provinsi:req.params.kode_provinsi
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };
