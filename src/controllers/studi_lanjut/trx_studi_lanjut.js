const ref_sbm_studi_lanjut = require("../../models/studi_lanjut/ref_studi_lanjut")
const trx_pegawai_studi_lanjut = require("../../models/studi_lanjut/trx_sbm_studi_lanjut")
const {jsonFormat} = require("../../utils/jsonFormat")

exports.index = (req, res, next) => {
    return trx_pegawai_studi_lanjut.findAll({
        attributes : {
            exclude : ["ucr","uch","udcr","udch"]
        },
        include : {
            model : ref_sbm_studi_lanjut, 
            as : 'RefStudiLanjut'
        }
    })
    .then((app) => {
        return jsonFormat(res,"success","Data Berhasil Ditampilkan",app);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.showById = (req, res, next) => {
    const param = {
        kode_trx : req.params.kode_trx
    }

    return trx_pegawai_studi_lanjut.findOne({
        attributes : {
            exclude : ["ucr","uch","udcr","udch"]
        },
        include : {
            model : ref_sbm_studi_lanjut, 
            as : 'RefStudiLanjut'
        }
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success","Data Berhasil Ditampilkan", app)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.store = (req, res, next) => {
    const add = {
        kode_ref_studi_lanjut: req.body.kode_ref_studi_lanjut,
        nip                  : req.body.nip,
        nama                 : req.body.nama,
        tahun                : req.body.tahun,
        npwp                 : req.body.npwp,
        kode_bank            : req.body.kode_bank,
        nama_bank            : req.body.nama_bank,
        no_rekening          : req.body.no_rekening,
        atas_nama_rekening   : req.body.atas_nama_rekening,
        volume1              : req.body.volume1,
        jumlah               : req.body.jumlah,
        keterangan           : req.body.keterangan
    }
    const request = req.body;
    const data = request.map((item) => {
        return {
            kode_ref_studi_lanjut: item.kode_ref_studi_lanjut,
            nip                  : item.nip,
            nama                 : item.nama,
            tahun                : item.tahun,
            npwp                 : item.npwp,
            kode_bank            : item.kode_bank,
            nama_bank            : item.nama_bank,
            no_rekening          : item.no_rekening,
            nomor_surat_tugas    : item.nomor_surat_tugas,
            atas_nama_rekening   : item.atas_nama_rekening,
            volume1              : item.volume1,
            jumlah               : item.jumlah,
            keterangan           : item.keterangan
        }
    })
    const param = request.map((item) => {
        return {
            kode_ref_studi_lanjut: item.kode_ref_studi_lanjut,
            nip                  : item.nip,
        }
    })
    // console.log(data)
    // console.log(param)
    return trx_pegawai_studi_lanjut.findAll({
        where : param
    })
    .then((app) => {
        if(app.length !== 0 ){
            const error = new Error("Data Sudah Ada")
            error.statusCode = 422
            throw error
        }
        return trx_pegawai_studi_lanjut.bulkCreate(data);
    })
    .then((appCreate) => {
        if(!appCreate) {
            const error = new Error("Data Gagal Insert")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success", "Data Berhasil Diinput", appCreate)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.update = (req, res, next) => {
    const param = {
        kode_trx : req.params.id
    }
    const upd = {
        nip : req.body.nip, 
        nama : req.body.nama, 
        tahun : req.body.tahun,
        npwp : req.body.npwp,
        kode_bank : req.body.kode_bank,
        nama_bank : req.body.nama_bank,
        no_rekening : req.body.no_rekening,
        atas_nama_rekening : req.body.atas_nama_rekening, 
        volume1 : req.body.volume1,
        jumlah : req.body.jumlah, 
        keterangan : req.body.keterangan
    }

    trx_pegawai_studi_lanjut.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return trx_pegawai_studi_lanjut.update(upd,{
            where : param
        });
    })
    .then((appUpdate) => {
        if(!appUpdate) {
            const error = new Error("Data Gagal Update ")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success", "Data Berhasil Update", upd);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.destroy = (req, res, next) => {
    const param = {
        kode_trx : req.params.id
    }
    
    return trx_pegawai_studi_lanjut.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return trx_pegawai_studi_lanjut.destroy(param);
    })
    .then((appDelete) => {
        if(!appDelete) {
            const error = new Error("Data Gagal Hapus")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success", "Data Berhasil Hapus", appDelete);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}
