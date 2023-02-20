const DanaAwalUP = require("../../models/UP/ref_dana_awal_up")
const {jsonFormat} = require("../../utils/jsonFormat")

exports.getByUnit = (req, res, next) => {
    const param = {
        kode_unit : req.params.id
    }

    return DanaAwalUP.findAll({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, "success", "Data Berhasil Ditampilkan", app);
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.updateDanaSisa = (req, res, next) => {
    const param = {
        kode_unit : req.params.id
    }

    const add = {
        dana_sisa_up : req.body.dana_sisa_up
    }

    return DanaAwalUP.findOne({
        where : param,
        raw : true
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Unit Tidak Ada")
            error.statusCode = 422
            throw error
        }
        if(add.dana_sisa_up > app.dana_awal_up) {
            const error = new Error("Data Melebihi Pagu")
            error.statusCode = 422
            throw error
        }
        if(app.dana_sisa_up > 0) {
            dana_sisa = parseInt(app.dana_sisa_up) + add.dana_sisa_up
        } else {
            dana_sisa = add.dana_sisa_up
        }
        
        let dana_tersedia = app.dana_tersedia - add.dana_sisa_up 
        console.log(dana_sisa)
        return DanaAwalUP.update({
            dana_sisa_up : dana_sisa,
            dana_tersedia : dana_tersedia
        }, {
            where : param
        });
    })
    .then((appUpdate) => {
        if(!appUpdate) {
            const error = new Error("Data Gagal Update")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res,"success", "Data Berhasil Update", add)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}