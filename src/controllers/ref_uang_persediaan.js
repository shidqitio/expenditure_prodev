const { jsonFormat } = require("../utils/jsonFormat");
const TrxUangPersediaanAwal = require("../models/trxUangPersediaanAwal");
const { validationResult } = require("express-validator");
const db = require("../config/database");


exports.getbytahun = (req,res,next) =>{
    const tahun = parseInt(req.params.tahun);
    TrxUangPersediaanAwal.findAll({where:{tahun:tahun}})
    .then((dataTahun)=>{
        if(dataTahun.length === 0){
            let err = new Error("data tidak Ada")
            err.statusCode = 422
            throw err
        }
        jsonFormat(res,"success","berhasil Menampilkan data",dataTahun)
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}

exports.getbytahunkodeunit = (req,res,next) =>{
    TrxUangPersediaanAwal.findOne({where:req.params})
    .then((data)=>{
        if(!data){
            let err = new Error("data tidak Ada")
            err.statusCode = 422
            throw err
        }
        jsonFormat(res,"success","berhasil Menampilkan data",data)
    }).catch((err)=>{
        jsonFormat(res, "failed", err.message, []);
    })
}