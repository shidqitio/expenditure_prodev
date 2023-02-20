const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes } = require("sequelize");
const Provinsi = require("../models/ref_geo_provinsi");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res, next) => {
    try {
      const data = await Provinsi.findAll({include: 'negara'});
      if (data === null)
      return jsonFormat(res, "failed", "data negara tidak ada", []);

      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.getbyprimarykey = async (req, res, next) => {
    try {
      const data = await Provinsi.findOne({
        where:{kode_provinsi:req.params.kode_provinsi},
        include: 'negara'
      });
      if (data === null)
        return jsonFormat(res, "failed", "data negara tidak ada", []);

      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.getbykodenegara = async (req, res, next) => {
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

  exports.create = async (req,res,next) => {
    try{
    const kodeprov = req.body.kode_negara+"."+req.body.kode_provinsi
    const data = await Provinsi.findAll({where:{kode_provinsi:kodeprov}});
    if(data.lenght > 0){
      return jsonFormat(res, "failed","data telah ada di database", []);
    }
      await Provinsi.create({
        kode_negara:req.body.kode_negara,
        kode_provinsi:req.body.kode_negara+"."+req.body.kode_provinsi,
        nama_provinsi:req.body.nama_provinsi,
        ibukota_provinsi:req.body.ibukota_provinsi,
        ucr: req.body.ucr,
      })
      jsonFormat(res, "success", "Berhasil membuat data", []);
    }catch(error){
      jsonFormat(res, "failed", error.message, []);}
  }

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await Provinsi.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data Provinsi tidak ada", []);
  
      await Provinsi.destroy({
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
      const data = await Provinsi.findOne({
        where: { kode_provinsi:req.params.kode_provinsi},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data provinsi tidak ada", []);
  
      await Provinsi.update(req.body, {
        where: {
          kode_provinsi:req.params.kode_provinsi
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };

  