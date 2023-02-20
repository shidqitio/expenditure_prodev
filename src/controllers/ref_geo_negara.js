const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes } = require("sequelize");
const Negara = require("../models/ref_geo_negara");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res, next) => {
    try {
      const data = await Negara.findAll({attributes: ['kode_negara', 'nama_negara',
    'ibukota_negara','ucr']});
      if (data === null)
      return jsonFormat(res, "failed", "data negara tidak ada", []);

      jsonFormat(res, "success", "Berhasil memuat data", data);
      global.socketIO.emit("data_negara", data)
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.getbyprimarykey = async (req, res, next) => {
    try {
      const data = await Negara.findAll({
        where:{kode_negara:req.params.kode_negara}
      });
      if(data === null){
        return jsonFormat(res, "failed", "tidak ada data yang ditampilkan", []);
      }

      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

  exports.create = async (req,res,next) => {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return jsonFormat(res, "failed", "validation failed", errors);
  }
    const data = await Negara.findAll({where:{kode_negara:req.body.kode_negara}});
    if(data.lenght > 0){
      return jsonFormat(res, "failed","data telah ada di database", []);
    }
    try{
      await Negara.create({
        kode_negara:req.body.kode_negara,
        nama_negara:req.body.nama_negara,
        ibukota_negara:req.body.ibukota_negara,
        ucr: req.body.ucr,
      })
      jsonFormat(res, "success", "Berhasil membuat data", []);
    }catch(error){
      jsonFormat(res, "failed", error.message, []);}
  }

  exports.deleteData = async (req, res, next) => {
    try {
      const data = await Negara.findOne({
        where: { kode_negara:req.params.kode_negara},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data SBM tidak ada", []);
  
      await Negara.destroy({
        where: {
          kode_negara:req.params.kode_negara
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
      const data = await Negara.findOne({
        where: { kode_negara:req.params.kode_negara},
      });
  
      if (data === null)
        return jsonFormat(res, "failed", "data negara tidak ada", []);
  
      await Negara.update(req.body, {
        where: {
          kode_negara:req.params.kode_negara
        },
      });
  
      jsonFormat(res, "success", "Berhasil memperbarui data", []);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  };

  