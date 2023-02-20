const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const {jsonFormat} = require("../../../utils/jsonFormat");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin")
const db = require("../../../config/database")
const debug = require("log4js")
const logger = debug.getLogger();

exports.storeProses = (req, res, next) => {
    request = req.body 
    let param = {
        id_surat_tugas : req.params.id
    }

    let upd = {
        kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
        kode_aktivitas_rkatu   : req.body.kode_aktivitas_rkatu,
        kode_rka               : req.body.kode_rka,
        kode_periode           : req.body.kode_periode,
        kode_status            : 3
    }

    let data_insert = request.Komponen.map((item) => {
        let biaya_satuan = item.biaya_satuan
        let jumlah = item.jumlah
        let total = biaya_satuan * jumlah
        
        return { 
            kode_petugas       : item.kode_petugas,
            keterangan_komponen: item.keterangan_komponen,
            kode_satuan        : item.kode_satuan,
            biaya_satuan       : item.biaya_satuan,
            jumlah             : item.jumlah,
            total              : total,
            mekanisme          : item.mekanisme,
            mekanisme_atcost   : item.mekanisme_atcost,
        }
    })
    return db.transaction()
    .then((t) => {
        return KomponenPerjadin.bulkCreate(data_insert, {transaction : t})
        .then((appBulk) => {
            if(!appBulk) {
                const error = new Error("Bulk Insert Gagal")
                error.statusCode = 422
                throw error
            }
            return SuratTugasPerjadin.update(upd, {
                where : param, 
                transaction : t
            });
        })
        .then((appUpd) => {
            if(!appUpd) {
                const error = new Error("Update Gagal")
                error.statusCode = 422
                throw error
            }
            return t.commit();
        })
        .catch((err) => {
            t.rollback()
            throw err
        });
    })
    .then(() => {
        return jsonFormat(res, 'success', 'Berhasil Membuat Komponen', {
            "Bulk Create" : data_insert, 
            "Update" : upd
        });
    })
    .catch((err) => { 
        logger.debug(err) 
        logger.error(err)
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.storeDraft = (req, res, next) => {
    request = req.body 
    let param = {
        id_surat_tugas : req.params.id
    }

    let upd = {
        kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
        kode_aktivitas_rkatu   : req.body.kode_aktivitas_rkatu,
        kode_rka               : req.body.kode_rka,
        kode_periode           : req.body.kode_periode,
        kode_status            : 14
    }

    let data_insert = request.Komponen.map((item) => {
        let biaya_satuan = item.biaya_satuan
        let jumlah = item.jumlah
        let total = biaya_satuan * jumlah
        
        return { 
            kode_petugas       : item.kode_petugas,
            keterangan_komponen: item.keterangan_komponen,
            kode_satuan        : item.kode_satuan,
            biaya_satuan       : item.biaya_satuan,
            jumlah             : item.jumlah,
            total              : total,
            mekanisme          : item.mekanisme,
            mekanisme_atcost   : item.mekanisme_atcost,
        }
    })
    return db.transaction()
    .then((t) => {
        return KomponenPerjadin.bulkCreate(data_insert, {transaction : t})
        .then((appBulk) => {
            if(!appBulk) {
                const error = new Error("Bulk Insert Gagal")
                error.statusCode = 422
                throw error
            }
            return SuratTugasPerjadin.update(upd, {
                where : param, 
                transaction : t
            });
        })
        .then((appUpd) => {
            if(!appUpd) {
                const error = new Error("Update Gagal")
                error.statusCode = 422
                throw error
            }
            return t.commit();
        })
        .catch((err) => {
            t.rollback()
            throw err
        });
    })
    .then(() => {
        return jsonFormat(res, 'success', 'Berhasil Membuat Komponen', {
            "Bulk Create" : data_insert, 
            "Update" : upd
        });
    })
    .catch((err) => { 
        logger.debug(err) 
        logger.error(err)
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.update = (req, res, next) => {
    let param = {
        kode_komponen : req.params.id
    }

    let upd = {
        keterangan_komponen: req.body.keterangan_komponen,
        kode_satuan        : req.body.kode_satuan,
        biaya_satuan       : req.body.biaya_satuan,
        jumlah             : req.body.jumlah,
    }

    let total = upd.biaya_satuan * upd.jumlah

    return KomponenPerjadin.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return KomponenPerjadin.update(
            {
                kode_satuan : upd.kode_satuan, 
                biaya_satuan : upd.biaya_satuan, 
                jumlah : upd.jumlah, 
                total : total
            }, 
            {
                where : param
            })
    })
    .then((appUpd) => {
        if(!appUpd) {
            const error = new Error ("Data Gagal Update")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Berhasil Mengubah Data', upd)
    })
    .catch((err) => { 
        logger.debug(err) 
        logger.error(err)
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.destroy = (req, res, next) => {
    let param = {
        kode_komponen : req.params.id
    }

    return KomponenPerjadin.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return KomponenPerjadin.destroy(
            {
                where : param
            });
    })
    .then((appDel) => {
        if(!appDel) {
            const error = new Error ("Data Gagal Hapus")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Berhasil Menghapus Data', appDel)
    })
    .catch((err) => { 
        logger.debug(err) 
        logger.error(err)
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}
