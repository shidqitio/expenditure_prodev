const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op } = require("sequelize");
const verifikasiSurat = require("../models/trx_verifikasi_surat");
const SuratTugasPerjadin = require("../models/ref_surat_tugas_perjadin");
const Status = require("../models/ref_status");
const Skema = require("../models/ref_skema_perjadin");
const { validationResult } = require("express-validator");
const { type } = require("express/lib/response");

exports.getbynipkatagori = async(req,res,next) =>{
   try
   {
       const data = await verifikasiSurat.findAll({
        include:'suratperjadinmany',
        where:{nip:req.params.nip,
       katagori:req.params.katagori, status:0 }
    })
    if(data === null || data.length === 0){
        jsonFormat(res, "failed", "Data tidak ditemukan", []);
      }

      jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
      jsonFormat(res, "failed", error.message, []);
    }
  }


  exports.getselesaibynipkatagori = async(req,res,next) =>{
    try
    {
        const data = await verifikasiSurat.findAll({
         include:'suratperjadinmany',
         where:{nip:req.params.nip,
        katagori:req.params.katagori, status:1 }
     })
     if(data === null){
         jsonFormat(res, "failed", "Data tidak ditemukan", []);
       }
 
       jsonFormat(res, "success", "Berhasil memuat data", data);
     } catch (error) {
       jsonFormat(res, "failed", error.message, []);
     }
   }


   exports.verifikasiunit = async(req,res,next) =>{
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return jsonFormat(res, "failed", "validation failed", errors);
    }
    const data = await verifikasiSurat.findOne({where:{
      "id_surat_tugas":req.body.id_surat_tugas,
      "nip":req.body.nip,
      "katagori":"unit",
      "status":0
    }
    })
    if(data === null){
    return  jsonFormat(res, "failed", "kamu tidak bisa memverifikasi lagi", []);
    }
    
    SuratTugasPerjadin.update({kode_status:4},{
      where:{id_surat_tugas:req.body.id_surat_tugas}
    })
    verifikasiSurat.update({status:1},{
      where:{"id_surat_tugas":req.body.id_surat_tugas,"nip":req.body.nip}
    })
    try{
    verifikasiSurat.create(
      {"id_surat_tugas":req.body.id_surat_tugas,
      "nip":req.body.nip_keuangan,
      "katagori":"keuangan",
      "status":0}
     )
     jsonFormat(res, "success", "Berhasil memverifikasi data", data);
       } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
       
   }
   exports.verifikasikeuangan = async(req,res,next) => { 
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return jsonFormat(res, "failed", "validation failed", errors);
    }
    try{
      const data = await verifikasiSurat.findOne({where:{
        "id_surat_tugas":req.body.id_surat_tugas,
        "nip":req.body.nip,
        "katagori":"keuangan",
        "status":0
      }
      })
      if(data === null){
      return  jsonFormat(res, "failed", "kamu tidak bisa memverifikasi lagi", []);
      }
      
      SuratTugasPerjadin.update({kode_status:5},{
        where:{id_surat_tugas:req.body.id_surat_tugas}
      })
      verifikasiSurat.update({status:1},{
        where:{"id_surat_tugas":req.body.id_surat_tugas,"nip":req.body.nip}
      })

     }catch(error){
      jsonFormat(res, "failed", error.message, []);
     }
   }

   