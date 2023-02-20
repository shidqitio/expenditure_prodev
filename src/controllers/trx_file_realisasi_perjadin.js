const express = require("express");
const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const fileRealisasiPerjadin = require("../models/trx_file_realisasi_perjadin");
const trxSPPD = require("../models/trx_sppd");
const { QueryTypes,Op,where,col,fn } = require("sequelize");
const db = require("../config/database");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");
const bodyParser = require("body-parser");
const hostHRIS = process.env.hostHRIS
const idAPI = require("../lang/id-api.json")

exports.getAll = async (req, res, next) => {
  try {
    const data = await fileRealisasiPerjadin.findAll();
    if (data === null)
    return jsonFormat(res, "failed", "data file tidak ada", []);

    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.cobattd = async (req, res, next) => {
  try {
    const data = await trxSPPD.findAll();
    if (data === null)
    return jsonFormat(res, "failed", "data file tidak ada", []);

    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
}

exports.multifile = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && !req.file) {

      jsonFormat(res, "failed", "Tidak ada data yang diinputkan", errors);
    }
    
    if (!req.file) {
      
      jsonFormat(res, "failed", "file yang diupload tidak sesuai format", []);
    }
  
    const filename = path.parse(req.file.filename).base;
        
    if (!errors.isEmpty()) {
      filePaths =  './src/public/perjadin/'+filename;
      fs.unlink(filePaths, (err) => {
        console.log("unlink error", err);
      });
      return jsonFormat(res, "failed", "validation failed", errors);
    }
  
 

  try{
    await fileRealisasiPerjadin.create({
      id_surat_tugas:req.body.id_surat_tugas,
      keterangan:req.body.keterangan,
      nip:req.body.nip,
      kode_komponen_honor:req.body.kode_komponen_honor,
      kode_kota_tujuan: req.body.kode_kota_tujuan,
      tahun:req.body.tahun,
      link_file:filename,
      biaya:req.body.biaya
    })
    jsonFormat(res, "success", "Upload berhasil", []);
  }catch(error){

    let filePaths =  './src/public/perjadin/'+filename;
      fs.unlink(filePaths, (err) => {
        console.log("unlink error", err);
      });
    jsonFormat(res, "failed", error.message, []);
  } 
  }

exports.tandatanganbarcode = async(req,res,next) => {
    try{
      await axios .get(`${hostHRIS}${idAPI.hris.trxjabatanstruktural}/${req.body.kode_unit_tujuan}`).then((data)=>{
      if(!data.data.data[0].nip){
          let err = new Error('data unit tidak ada pada kepegawaian')
          throw err
        }
        else if(data.data.data[0].nip !== req.body.nip_penandatangan){
          let err2 = new Error('nip penandatangan tidak sesuai')
          throw err2
        }

        return db.transaction().then((t) =>{
          PetugasPerjadinBiaya.update({status:1},{where:[where(
            fn('CONCAT', col('id_surat_tugas'), '-', col('nip'),'-', col('kode_unit_tujuan')), 
            { [Op.in]:req.body.databarcode })],transaction:t}).then((updatePPB)=>{
              if(updatePPB === 0){
              let err3 = new Error('tidak ada data yang sesuai barcode')
              throw err3
              }
              trxSPPD.create({
                kode_surat_tugas:req.body.kode_surat_tugas,
                nip:req.body.nip,
                kode_unit_tujuan:req.body.kode_unit_tujuan,
                kode_kota_tujuan:req.body.kode_kota_tujuan,
                geolokasi:req.body.geolokasi,
                waktulokasi:req.body.waktulokasi,
                nip_penandatangan:req.body.nip_penandatangan,
                nama_penandatangan:req.body.nama_penandatangan,
                jabatan:req.body.jabatan
              },{transaction:t}).then((createSPPD)=>{
                t.commit()
                jsonFormat(res, "success", "barcode success", createSPPD);
              }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "create data sppd gagal");})
            }).catch((err)=>{ t.rollback();jsonFormat(res, "failed", err.message, "update status petugas perjadin gagal berubah");})
        }).catch((err)=>{ jsonFormat(res, "failed", err.message, []);})

      }).catch((err)=>{ jsonFormat(res, "failed", err.message, []);})
    }catch(err){
      next(err)
    }
}

exports.tandatanganManual = async(req,res,next)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty() && !req.file) {

      jsonFormat(res, "failed", "Tidak ada data yang diinputkan", errors);
    }
    let filePaths = "./src/public/tandatanganmanual/"
    console.log("cek fileeeeeeeeeeeeeeeeeeee",req.files.file_link_ttd)
    if (!req.files.file_link_ttd || !req.files.file_link_foto) {
      if(req.files.file_link_ttd)
      {fs.unlink(filePaths+path.parse(req.files.file_link_ttd[0].filename).base, (err) => {
        console.log("unlink error", err);
      });
    }
      jsonFormat(res, "failed", "file yang diupload tidak sesuai format", []);
    }
  
    const filename1 = path.parse(req.files.file_link_ttd[0].filename).base;
    const filename2 = path.parse(req.files.file_link_foto[0].filename).base;

    console.log(filename1,"=",filename2)
    console.log("Body:",req.body)
  db.transaction().then((t)=>{
    PetugasPerjadinBiaya.update({status:1},{where:{kode_surat_tugas:req.body.kode_surat_tugas,nip:req.body.nip,kode_kota_tujuan:req.body.kode_kota_tujuan},transaction:t}).then((uBiaya)=>{
      if(uBiaya === 0){
        let err3 = new Error('tidak ada yang diupdate')
        throw err3
        }
        trxSPPD.create({
          kode_surat_tugas:req.body.kode_surat_tugas,
          nip:req.body.nip,
          kode_kota_tujuan:req.body.kode_kota_tujuan,
          geolokasi:req.body.geolokasi,
          waktulokasi:req.body.waktulokasi,
          nip_penandatangan:req.body.nip_penandatangan,
          nama_penandatangan:req.body.nama_penandatangan,
          jabatan:req.body.jabatan,
          file_link_ttd:filename1,
          file_link_foto:filename2
        },{transaction:t}).then((cSPPD)=>{
                t.commit()
                jsonFormat(res, "success", "tertanda berhasil", []);
        }).catch((err)=>{ t.rollback();
          fs.unlink(filePaths+filename1, (err) => {console.log("unlink error", err);});
          fs.unlink(filePaths+filename2, (err) => {console.log("unlink error", err);});
          jsonFormat(res, "failed", err.message, "create data sppd gagal");})
    }).catch((err)=>{ t.rollback();
      fs.unlink(filePaths+filename1, (err) => {console.log("unlink error", err);});
      fs.unlink(filePaths+filename2, (err) => {console.log("unlink error", err);});jsonFormat(res, "failed", err.message, "update data petugas perjadin biaya gagal");})
  }).catch((err)=>{ 
    fs.unlink(filePaths+filename1, (err) => {console.log("unlink error", err);});
    fs.unlink(filePaths+filename2, (err) => {console.log("unlink error", err);});
    jsonFormat(res, "failed", err.message, "db error");})
}

exports.remove = async (req, res, next) => {
    try {

      const data = await fileRealisasiPerjadin.findAll({where:{
        kode_trx: req.params.id_trx
      }});
      if (data.length === 0)
      return jsonFormat(res, "failed", "data file tidak ada", []);

      let filePaths =  './src/public/perjadin/'+req.params.link_file;
      fs.unlink(filePaths, (err) => {
        console.log("unlink error", err);
      });
      
      await fileRealisasiPerjadin.destroy({where:{
        kode_trx: req.params.id_trx
      }});
  
      jsonFormat(res, "success", "Berhasil menghapus data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }

