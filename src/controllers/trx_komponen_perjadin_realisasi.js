const express = require("express");
const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const KomponenPerjadinRealisasi = require("../models/trx_komponen_perjadin_realisasi");
const { QueryTypes,Op } = require("sequelize");
const db = require("../config/database");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getByKode = async (req,res,next) => {
 
    const komponenAll = await KomponenPerjadinRealisasi.findAll({
        where:{id_surat_tugas:req.body.id_surat_tugas, nip:req.body.nip, kode_komponen_honor: req.body.kode_komponen_honor,kode_kota_asal:req.body.kode_kota_asal}
    });
    try {
        jsonFormat(res, "success", "Berhasil memuat data", komponenAll);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
}

exports.getAll = async (req,res,next) => {
 
    const komponenAll = await KomponenPerjadinRealisasi.findAll();
    try {
        jsonFormat(res, "success", "Berhasil memuat data", komponenAll);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
}

exports.create = async (req,res,next) => {

        await KomponenPerjadinRealisasi.destroy({
            where:{id_surat_tugas:req.body.id_surat_tugas, nip:req.body.nip, kode_komponen_honor: req.body.kode_komponen_honor,kode_kota_asal:req.body.kode_kota_asal}
        })
    try {
        await KomponenPerjadinRealisasi.create({
            id_surat_tugas:req.body.id_surat_tugas, 
            nip:req.body.nip, 
            kode_komponen_honor: req.body.kode_komponen_honor,
            kode_kota_asal:req.body.kode_kota_asal,
            total:req.body.total,
            terpakai:req.body.terpakai,
            sisa_biaya:req.body.sisa_biaya,
            tahun:req.body.tahun
            // link_file:filename
        })
        jsonFormat(res, "success", "Berhasil menambahkan data", );
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
}

exports.multifile = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() && !req.file) {
    jsonFormat(res, "failed", error.message, []);
  }
  console.log("cek file:", req.file);
  if (req.file === undefined) {
    jsonFormat(res, "failed", "harap mmenginputkan file", []);
  }
  if (!req.file) {
    
    jsonFormat(res, "failed", "file yang diupload tidak sesuai format", []);
  }

  
  if (!errors.isEmpty()) {
    jsonFormat(res, "failed", "error.message3", []);
  }

//  next();
jsonFormat(res, "success", "Upload berhasil", []);
}