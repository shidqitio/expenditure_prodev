const ref_sbm_studi_lanjut = require("../../models/studi_lanjut/ref_studi_lanjut")
const {jsonFormat} = require("../../utils/jsonFormat")

exports.index = (req ,res, next) => {
    return ref_sbm_studi_lanjut.findAll({
        attributes : {
            exclude : ["ucr", "uch", "udcr", "udch"]
        }
    })
    .then((app) =>{
        return jsonFormat(res, "success", "Data Berhasil Ditampilkan", app);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.showByKode = (req, res, next) => {
    const param = {
        kode_surat : req.params.id, 
    }

    return ref_sbm_studi_lanjut.findOne({
        where : param, 
        attributes : {
            exclude : ["ucr", "uch", "udcr", "udch"]
        }
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success", "Berhasil Menampilkan Data", app);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.showByJenjang = (req, res, next) => {
    const param = {
        jenjang : req.params.id
    }

    return ref_sbm_studi_lanjut.findAll({
        where : param
    })
    .then((app) => {
        return jsonFormat(res, "success", "Data Berhasil Tampil", app);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}