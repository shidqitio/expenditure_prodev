
const { jsonFormat } = require("../utils/jsonFormat");
const request = require("request");
const { validationResult } = require("express-validator");
const db = require("../config/database");
const { QueryTypes,fn,col } = require("sequelize");
const axios = require("axios");
const { readlink } = require("fs");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
const hostEbudgeting = process.env.hostEbudgeting;
const idAPI = require("../lang/id-api.json")



exports.byunitandmonthnew = async (req, res, next) => {
  await axios
  .get(
    `${hostEbudgeting}${idAPI.ebudgeting.rka_unitbulan}/${req.params.unit}/${req.params.bulan}/${req.params.program}`
  ).then((ebudgeting) =>{
    if(ebudgeting.data.status === 'failed'){
      let err = new Error(ebudgeting.data.message);
      err.statusCode = 402;
      throw err
    }
    if(ebudgeting?.data?.values.length === 0){
      let err = new Error("Data dari Ebudgeting kosong");
      err.statusCode = 200;
      throw err
    }

    return ebudgeting?.data?.values
  }).then((rka)=>{
    
    jsonFormat(res, "success", "menampilkan data rka", rka);
  }).catch((err)=>{
    next(err)
  })
}

exports.byunitandmonthspesifik = async (req, res, next) => {
  await axios
  .get(
    `${hostEbudgeting}${idAPI.ebudgeting.rka_unit_bulan}/${req.params.unit}/${req.params.bulan}/${req.params.program}`
  ).then((ebudgeting) =>{
    if(ebudgeting.data.status === 'failed'){
      let err = new Error(ebudgeting.data.message);
      err.statusCode = 402;
      throw err
    }
    if(ebudgeting?.data?.values.length === 0){
      let err = new Error("Data dari Ebudgeting kosong");
      err.statusCode = 200;
      throw err
    }

    return ebudgeting?.data?.values
  }).then((rka)=>{
    
    jsonFormat(res, "success", "menampilkan data rka", rka);
  }).catch((err)=>{
    next(err)
  })
}



