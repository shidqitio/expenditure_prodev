const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const { QueryTypes,Op,fn,col,literal } = require("sequelize");
const db = require("../config/database");
const puppeteer  = require("puppeteer");
const SuratTugasRKAPerjadin = require("../models/ref_surat_tugas_rka_perjadin");
const SuratTugasRKAHonor = require("../models/ref_surat_tugas_rka_honor");

// const { get } = require("express/lib/response");
const fs = require('fs');
const https = require('https');
const path = require("path");
const request = require('request');

exports.cekRKA = async(req,res,next)=>{
    const perjadin = await SuratTugasRKAPerjadin.findAll({where:{kode_rka:req.params.kode_rka}})
    const honorarium = await SuratTugasRKAHonor.findAll({where:{kode_rka:req.params.kode_rka}})
    try{
        if(perjadin.length>0 || honorarium.length>0){
            jsonFormat(res, "success", "RKA terdapat di Expenditure", []);
        }else{
            let error = new Error("RKA tidak terdapat di expenditure")
            throw error
        }
    }catch(err){
        jsonFormat(res, "failed", err.message, []);
    }
    
}

exports.ganttchartmergernew = async (req,res,next) =>{
    const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/periodekegiatan/nest`);
  
    const aktivitas = e_budgeting.data.values.aktivitas;
    const realisasidaripengurangan = await SuratTugasRKAPerjadin.findAll({
      attributes: [`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`,
       [fn('sum', col(`jumlah_budget`)),`jumlah_budget`]],
       group :[`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_RKA`,`kode_periode`]});
     
       let arrrealisasiRKA = [{
        "kode_kegiatan_ut_detail": 0,
        "kode_aktivitas_rkatu": 0,
        "kode_periode": 0,
        "jumlah_budget": 0,
        "kode_RKA":0,
      }]
       realisasidaripengurangan.map((rdr)=>{
        let jumlah_budget = parseInt(rdr.jumlah_budget) 
        arrrealisasiRKA.push({
          "kode_kegiatan_ut_detail": rdr.kode_kegiatan_ut_detail,
          "kode_aktivitas_rkatu": rdr.kode_aktivitas_rkatu,
          "kode_periode": rdr.kode_periode,
          "jumlah_budget": jumlah_budget,
          "kode_RKA":rdr.kode_RKA,
        })
       })
   // let arrAktivitas = [];
    let arrsubAtivitas = [];
    let arrbulan = ["","Januari","Febuari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    
    console.log("Bulan ",arrbulan[1]);
    aktivitas.map((ak) => {
      
     
      ak.subAktivitas.map((sak)=>{
       let arrrealisasi = [];
       //let arrrencanatarget = [];
       
       sak.rencanaTarget.map((rt)=>{
         let realpersen = 0;
         let realjumlah = 0;
         let bulan_periode = parseInt(rt.bulan_akhir)
         arrrealisasiRKA.map((rv)=>{
            if(
              rv.kode_aktivitas_rkatu === ak.key &&
               rv.kode_RKA === sak.key
              &&
               rv.kode_periode === bulan_periode
              ){
               realpersen = rv.jumlah_budget/sak.alokasi_aktivitas_sub*100;
               realjumlah = rv.jumlah_budget;
               
            }
         })
         arrrealisasi.push({
           key:rt.key,
           bulan:rt.bulan_akhir,
           nama_bulan: arrbulan[rt.bulan_akhir],
           rt_persen:rt.persen,
           ex_persen: realpersen,
           rt_jumlah:rt.jumlah_akhir,
           ex_jumlah:realjumlah,
           keterangan: "RT dari Ebudgeting dan EX dari Expenditure"
         });
         
   
   
       })
       arrsubAtivitas.push({
         //key:sak.key,
         kode_aktivitas: ak.key,
         nama_aktivitas:ak.nama_aktivitas,
         alokasi_aktivitas:ak.alokasi_aktivitas,
         kode_aktifitas_sub:sak.key,
         nama_aktivitas_sub:sak.nama_aktivitas_sub,
         BAS:sak.BAS,
         alokasi_aktivitas_sub:sak.alokasi_aktivitas_sub,
         //rencanaTarget :arrrencanatarget,
         realisasi:arrrealisasi
       })
     })
   
    
    });
   
     try{
    return jsonFormat(res, "success", "data tampil", arrsubAtivitas);
    }catch(err){
        jsonFormat(res, "failed", err.message, []);
    }
   
   }

exports.ganttcharTriwulan = async (req,res,next) =>{
  const kode_trx_rkatu = parseInt(req.params.kode_trx_rkatu)
  //API dari E_budgeting
  try{
  const e_budgeting = await axios .get(`https://dev-sippp.ut.ac.id:4400/ebudgeting/apiv1/rkaunit/triwullan/nest/${req.params.kode_unit}/${req.params.kode_trx_rkatu}`);
  if(e_budgeting.data.values.length === 0){
    let err = new Error("Data dari ebudgeting kosong")
    err.statusCode = 422
    throw err
  }
  const dataEbudgeting = e_budgeting.data.values;
  const realisasidaripengurangan = await SuratTugasRKAPerjadin.findAll({
    attributes: [`kode_kegiatan_ut_detail`,`kode_aktivitas_rkatu`,`kode_rka`,`kode_periode`,
     [fn('sum', col(`jumlah_budget`)),`jumlah_budget`],
     [literal(`sum(CASE WHEN kode_periode IN(1,2,3) THEN jumlah_budget ELSE 0 END)`),'triwullan1'],
     [literal(`sum(CASE WHEN kode_periode IN(4,5,6) THEN jumlah_budget ELSE 0 END)`),'triwullan2'],
     [literal(`sum(CASE WHEN kode_periode IN(7,8,9) THEN jumlah_budget ELSE 0 END)`),'triwullan3'],
     [literal(`sum(CASE WHEN kode_periode IN(10,11,12) THEN jumlah_budget ELSE 0 END)`),'triwullan4']
    ],
     where:{kode_unit:req.params.kode_unit,kode_RKA:kode_trx_rkatu},
      raw: true
    });

     let arrUtDetail = []
     dataEbudgeting.map((d)=>{
      let arrAktivitas = []
      if(d.aktivitas){
        d.aktivitas.map((a)=>{
          let arrsubAtivitas = []
          if(a.subAktivitas){
            a.subAktivitas.map((sa)=>{
              let arrrencanaTarget = []
              if(sa.rencanaTarget){
                sa.rencanaTarget.map((rt)=>{
                  let triExpenditure = 0
                  realisasidaripengurangan.map((rp)=>{
                    if(rt.triwullan === 1){
                      triExpenditure = parseInt(rp.triwullan1)
                    }else if(rt.triwullan === 2){
                      triExpenditure = parseInt(rp.triwullan2)
                    }
                    else if(rt.triwullan === 3){
                      triExpenditure = parseInt(rp.triwullan3)
                    }
                    else if(rt.triwullan === 4){
                      triExpenditure = parseInt(rp.triwullan4)
                    }
                  })

                  arrrencanaTarget.push({
                    "triwullan": rt.triwullan,
                    "kode_periode": rt.kode_periode,
                    "total_anggaran_triwullan": rt.total_anggaran_triwullan,
                    "expenditure": triExpenditure
                  })
                })
              }
              arrsubAtivitas.push({
                "kode_trx_rkatu": sa.kode_trx_rkatu,
                "nama_aktivitas_sub": sa.nama_aktivitas_sub,
                "BAS": sa.BAS,
                "alokasi_aktivitas_sub": sa.alokasi_aktivitas_sub,
                "expenditure":parseInt(realisasidaripengurangan[0].jumlah_budget),
                "rencanaTarget": arrrencanaTarget
              })
            })
          }
          arrAktivitas.push({
        "kode_aktivitas_rkatu": a.kode_aktivitas_rkatu,
        "nama_aktivitas": a.nama_aktivitas,
        "alokasi_aktivitas": a.alokasi_aktivitas,
        "subAktivitas":arrsubAtivitas
          })
        })
      }
      arrUtDetail.push({
        "kode_ut_detail": d.kode_ut_detail,
        "id_unit": d.id_unit,
        "kode_unit": d.kode_unit,
        "nama_unit": d.nama_unit,
        "alokasi_unit": d.alokasi_unit,
        "Aktivitas":arrAktivitas
      })
     })


     jsonFormat(res, "success", "data tampil", arrUtDetail);
    }catch(error){
      next(error)
    }
}

exports.biayaterpakaiunitperbulan = async(req,res,next) =>{
  try{
    const sumRKAPerjadin = await SuratTugasRKAPerjadin.sum('jumlah_budget',{where:{kode_unit:req.params.kode_unit,kode_periode:req.params.kode_periode}})
    const sumRKAHonorarium = await SuratTugasRKAHonor.sum('jumlah_budget',{where:{kode_unit:req.params.kode_unit,kode_periode:req.params.kode_periode}})
    let dataTerpakai = 0+sumRKAPerjadin+sumRKAHonorarium;

    let data = {
      dataTerpakai:dataTerpakai
    }
    return jsonFormat(res, "success", "data tampil", data);
  }catch(err){
    return next(err)
  }
}