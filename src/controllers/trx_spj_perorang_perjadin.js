const { jsonFormat } = require("../utils/jsonFormat");
const axios = require("axios");
const SkemaPerjadin = require("../models/ref_skema_perjadin");
const { validationResult } = require("express-validator");
const PetugasPerjadinBiaya = require("../models/trx_petugas_perjadin_biaya");
const spjPerorang =require("../models/trx_spj_perorang_perjadin");
const tVA = require("../models/t_VA");
const { QueryTypes,Op } = require("sequelize");
const SuratAtcost = require("../models/ref_surat_atcost")
const db = require("../config/database");
const { type } = require("express/lib/response");
const { stat } = require("fs");
const { response } = require("express");
const hostutpay = process.env.hostutpay
const idAPI = require("../lang/id-api.json")
const siakun = require("../middleware/siakun")
const { getSignature } = require("../middleware/headersUtBank");
const { log } = require("console");

exports.getByUnit = async (req,res,next) => {

    spjPerorang.findAll({where:{kode_unit:req.params.kode_unit,status:"-01"}}).then((data)=>
    {
        if(data.length === 0){
             let error = new Error('Data tidak ditemukan')
             throw error
        }
        jsonFormat(res, "success", "Berhasil memuat data", data);
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}

exports.getByNip = async (req,res,next) => {

    spjPerorang.findAll({where:{nip:req.params.nip}}).then((data)=>
    {
        if(data.length === 0){
            let error = new Error('Data tidak ditemukan')
             throw error
        }
        jsonFormat(res, "success", "Berhasil memuat data", data);
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}

exports.getByprimarykey = async (req,res,next) => {

    spjPerorang.findAll({where:{nip:req.params.nip,kode_surat:req.params.kode_surat,kode_kota_tujuan:req.params.kode_kota_tujuan}}).then((data)=>
    {
        if(data.length === 0){
            throw error('Data tidak ditemukan')
        }
        jsonFormat(res, "success", "Berhasil memuat data", data);
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}


exports.create = async (req,res,next) => {

    await spjPerorang.findAll({where:{nip:req.body.nip,kode_surat:req.body.kode_surat,kode_kota_tujuan:req.body.kode_kota_tujuan}}).then((data)=>
    {
        if(data.length > 0){
            let error = new Error('Data pernah di inputkan')
             throw error
        } 
        const header = getSignature(
          req.method,
          "/bri/v1/payment-va"
        );

        return db.transaction()
        .then(async(t) => {
            let VA = "-"
            let stats,keterangan
            if(req.body.nominal > 0){
                // let characters ='Expenditure';
                // randomchar = '';
                // charactersLength = characters.length;
                // for ( let i = 0; i < 11; i++ ) {
                //     randomchar += characters.charAt(Math.floor(Math.random() * charactersLength));
                // }
                // VA = req.body.kode_surat+randomchar+req.body.nip+req.body.kode_kota_tujuan;
                stats = "+01";
                keterangan = "Pengembalian dana lebih"

                VA = await axios
                  .post(`${hostutpay}${idAPI.utpay.payment_va}`, {
                    identityNumber: req.body.nip,
                    bankCode: req.body.kode_bank,
                    accountName: req.body.nama,
                    paymentType: req.body.tipe_pembayaran,
                    amountType: "CREDIT",
                    paymentType:"1",
                    amount: req.body.nominal,
                    description: `${req.body.kode_kota_tujuan}`,
                    device: req.body.device,
                    browser: req.body.browser,
                    location: req.body.location,
                    ucr: req.body.ucr,
                  }, {
                    headers: header
                  })
                  .then((a) => {
                    console.log(a.data)
                    return a.data.data.noVa;

                })
                  .catch((err) => {
                    console.log(err)
                    throw new Error("UT BANK PAY Error");
                  });

            } else if(req.body.nominal < 0){
                stats = "-01"
                keterangan = "Pengajuan dana kurang"
            }else{stats = "00";
            keterangan = "Realisasi sudah sesuai"}
            
            return spjPerorang.create({
                kode_unit:req.body.kode_unit,
                kode_surat:req.body.kode_surat,
                nip:req.body.nip,
                kode_rka:req.body.kode_rka,
                bulan_rka:req.body.kode_periode,
                kode_kota_tujuan:req.body.kode_kota_tujuan,
                nomor_surat_tugas:req.body.nomor_surat_tugas,
                tanggal_surat:req.body.tanggal_surat,
                kota_tujuan:req.body.kota_tujuan,
                nomor_virtual_account:VA,
                kode_nomor_spm:"-",
                status:stats ,
                nominal:req.body.nominal,
                keterangan: keterangan,
                ucr:req.body.ucr
            },{transaction:t})
            .then(()=>{
                if(req.body.nominal > 0){
                return tVA.create({
                    nip:req.body.nip,
                    kode_surat:req.body.kode_surat,
                    kode_sub_surat:req.body.kode_kota_tujuan,
                    kode_VA:VA,
                    kode_bank:req.body.kode_bank,
                    nominal:req.body.nominal,
                    ucr:req.body.ucr,
                    status:"BELUM-DIBAYAR"
                },{transaction:t})
            }
            }).then((create)=>{
                PetugasPerjadinBiaya.update({status_pengusulan:2},{where:{id_surat_tugas:req.body.kode_surat,nip:req.body.nip,kode_kota_tujuan:req.body.kode_kota_tujuan}})
                 t.commit()
                jsonFormat(res, "success", "Berhasil memuat data", create);
        }).catch((err)=>{
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            t.rollback();
            jsonFormat(res, "failed", err.message, []);
        })
        })
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}

exports.detailVA = async(req,res,next) =>{
    try{
        const header = getSignature(
          req.method,
          `${idAPI.utpay.bri_v1_payment_detail}/${req.params.nomor_va}`
        );

        console.log(header);
        const data = await axios.get(`${hostutpay}${idAPI.utpay.payment_detail}/${req.params.nomor_va}`, {
            headers: header
        }).then((response)=>{
        if(response.data.data === null){
            throw new Error('Error dari UT PAYMENT')
        }    
        return response.data.data
        }).catch((err)=>{return err})

        jsonFormat(res, "success", "detail Virtual Account", data);
    }catch(error){
        next(error)
    }
}

exports.pushNotifVA = async(req,res,next) =>{
    try{
        const updateVA = await tVA.update({status:1},{kode_VA:req.params.kode_VA})
        jsonFormat(res,"success","Berhasil mengupdate date".updateVA)
    }catch(err){
        next(err)
    }
}

exports.updateVA = async(req,res,next) =>{
    try{

    }catch(err){

    }
}

exports.createVA = async(req,res,next) =>{
    try{

    }catch(err){
        
    }
}

// 1. ambil list user yang atcost
exports.userAtCost = (req, res, next) => {
  const kodeUnit = req.body.kode_unit;

  spjPerorang
    .findAll({ where: { status: "-01", kode_unit: kodeUnit } })
    .then((spo) => {
      jsonFormat(res, "success", "berhasil menampilkan data", spo);
    })
    .catch((err) => {
      next(err);
    });
};

// 2. simpan petugas perjadin add cost, update status spj
exports.addSuratCost = (req, res, next) => {
  // pagu (select)
  const kodeMenu = "M08.01.01";
  const tanggal = new Date();

  // nip
  const kodeSurat = req.body.kodeSurat;
  const nip = req.body.nip;
  const kodeTrx = req.body.kodeTrx
  const kodeKotaTujuan = req.body.kodeKotaTujuan;
  const nomorSurat = req.body.noSurat;
  const perihal = req.body.perihal;
  const tanggalSurat = req.body.tanggalSurat;
  const kodeUnit = req.body.kodeUnit;
  const tahun = req.body.tahun;
  const kodeStatus = req.body.status;

  return db
    .transaction()
    .then((t) => {
      return SuratAtcost.max("kode_trx", { transaction: t }).then((max) => {
        return SuratAtcost.create(
          {
            kode_trx: max + 1,
            kode_surat: max + 1 + "-Atcost",
            kode_trx_spj: kodeTrx,
            nomor_surat: nomorSurat,
            perihal: perihal,
            tanggal_surat: tanggalSurat,
            kode_unit: kodeUnit,
            tahun: tahun,
            kode_status: kodeStatus,
          },
          {
            transaction: t,
          }
        )
          .then((newAtCost) => {
            if (!newAtCost) {
              throw new Error("gagal menyimpan data");
            }

            return spjPerorang.update(
              {
                status: "00",
              },
              {
                where: {
                  nip: nip,
                  kode_surat: kodeSurat,
                  kode_kota_tujuan: kodeKotaTujuan,
                },
                transaction: t,
              }
            );
          })
          .then((updatePetugas) => {
            console.log(updatePetugas);
            if (!updatePetugas) {
              throw new Error("gagal update data");
            }

            return spjPerorang.findOne({
              where: {
                nip: nip,
                kode_surat: kodeSurat,
                kode_kota_tujuan: kodeKotaTujuan,
              },
              transaction: t,
            });
          })
          .then((exPetugas) => {
            console.log("EXPETUGAS", exPetugas);
            return siakun.storePaguBalikan(
              tahun,
              kodeMenu,
              kodeSurat,
              tanggal,
              nomorSurat,
              exPetugas.kode_rka,
              exPetugas.bulan_rka,
              exPetugas.nominal * -2,
              req.body.ucr
            );
          })
          .then((apiRes) => {
            console.log("API", apiRes);
            if (!apiRes) {
              throw new Error("Api gagal");
            }
            t.commit();
          })
          .catch((err) => {
            console.log(err);
            t.rollback();
            throw err;
          });
      });
    })
    .then(() => {
      jsonFormat(res, "success", "berhasil", []);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getDetailSuratCost = (req, res, next) => {
  const kode_trx = req.params.kode_trx;

  SuratAtcost.findOne({
    where: {
      kode_trx:kode_trx
    },
  })
    .then((sc) => {
      jsonFormat(res, "success", "berhasil..", sc);
    })
    .catch((err) => {
      next(err);
    });
};