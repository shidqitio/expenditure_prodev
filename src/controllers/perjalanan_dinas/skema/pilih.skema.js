const debug = require("log4js");
const logger = debug.getLogger();
const { response } = require("express");
const {jsonFormat} = require("../../../utils/jsonFormat");
const refSelection = require("../../../models/ref_selection");
const refPerjalanan = require("../../../models/ref_perjalanan");
const refFilterSkema = require("../../../models/ref_filter_skema");
const SkemaPerjadin = require("../../../models/ref_skema_perjadin");
const trxtPerjalananSbm = require("../../../models/trx_perjalanan_sbm");
const trxKatagoriFilter = require("../../../models/trx_katagori_filter");
const refKatagoriPerjadin = require("../../../models/ref_katagori_perjadin");
const refSbmTransporPerjadin = require("../../../models/ref_sbm_transpor_perjadin");
const refSbmPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_perjalanan_dinas");

exports.pilihSkema = async (req,res,next) => {
        try {
        const data = await refSelection.findAll({
            where: {
                jenis: "LUAR KOTA"
            }
        });
        if(!data){
            jsonFormat(res, "failed", "No data!", []);
            logger.debug(`database pilihSkema no data : ${data}`);
        }
        jsonFormat(res, "success", "Berhasil memuat data", data);
    } catch (error) {
        jsonFormat(res, "failed", error.message, []);
        logger.debug(`database pilihSkema catch : ${err}`);
        logger.error(`database pilihSkema catch : ${err}`);
        next(err);
    }
}

exports.filterUang = (req,res,next) =>{
    trxKatagoriFilter.findAll({include:{
        model:refFilterSkema,
        as:"mKFilter"
    },where:{kode_trx_katagori:req.params.kode_trx_katagori,katagori:"UANG_HARIAN"}}).then((response)=>{
        if(response.length === 0){
            let erro = new Error("data filter tidak ada")
        }
        jsonFormat(res,"success","Berhasil Menampilkan data",response)
    }).catch((erro) =>{
        jsonFormat(res,"success",erro.message,[])
    })
}

exports.filterPenginapan = (req,res,next) =>{
    trxKatagoriFilter.findAll({include:{
        model:refFilterSkema,
        as:"mKFilter"
    },where:{kode_trx_katagori:req.params.kode_trx_katagori,kode_trx_filter_terkait:req.params.kode_trx_filter_terkait,katagori:"PENGINAPAN"}}).then((response)=>{
        if(response.length === 0){
            let erro = new Error("data filter tidak ada")
        }
        jsonFormat(res,"success","Berhasil Menampilkan data",response)
    }).catch((erro) =>{
        jsonFormat(res,"success",erro.message,[])
    })
}

exports.prosesHitung = async(req,res,next) =>{
    let petugas = req.body.petugas
    for(let i = 0;i < petugas.length;i++){
        let petugas = db.query()
    }
}

