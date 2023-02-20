const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const SbmUangHarian = require("../models/ref_sbm_uang_harian");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getAll = async (req, res, next) => {
    try {
      const data = await SbmUangHarian.findAll({include: ['provinsi']});
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
      const data = await SbmUangHarian.findOne({
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
      const data = await SbmUangHarian.findAll({
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
    const data = await SbmUangHarian.findOne({where:{kode_provinsi:req.body.kode_provinsi}});
    if(data !== null){
      return jsonFormat(res, "failed","data telah ada di database", []);
    }
      await SbmUangHarian.create({
        kode_provinsi:req.body.kode_provinsi,
        satuan:req.body.satuan,
        luarkota:req.body.luarkota,
        dalamkota:req.body.dalamkota,
        diklat:req.body.diklat,
        ucr: req.body.ucr,
      })
      jsonFormat(res, "success", "Berhasil membuat data", []);
    }catch(error){
      jsonFormat(res, "failed", error.message, []);}
  }

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await SbmUangHarian.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data SbmUangHarian tidak ada", []);
  
      await SbmUangHarian.destroy({
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
      const data = await SbmUangHarian.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data SbmUangHarian tidak ada", []);
  
      await SbmUangHarian.update(req.body, {
        where: {
          kode_provinsi:req.params.kode_provinsi
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };
