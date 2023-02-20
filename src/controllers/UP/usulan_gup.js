const RefUsulanGup = require("../../models/UP/ref_usulan_gup")
const RefDaftarPengadaan = require("../../models/UP/ref_daftar_pengadaan")
const RefDetailPengadaan = require("../../models/UP/ref_detail_pengadaan")
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan")
const RefDetailFoto = require("../../models/UP/ref_detail_foto")
const {jsonFormat} = require("../../utils/jsonFormat")
const pevita = require("../../utils/pevita")
const db = require("../../config/database")

exports.index = (req ,res, next) => {
    return RefUsulanGup.findAll({
        attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
        include : [
            {
                model : RefDaftarPengadaan, 
                as : "RefDaftarPengadaan",
                attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
            }
        ]
    })
    .then((app) => {
        return jsonFormat(res, 'success', 'Data Berhasil Ditampilkan', app)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.store_tes = (req, res, next) => {
    let kodemax;
    let id_surat_tugas; 
    let insert1;
    let nomor_surat;
    let request;
    let data;
    let data1;
    return RefUsulanGup.max('kode_surat')
    .then((max) => {
        let kode_surat = max + 1
        kodemax = kode_surat
        let katagori = "Usulan GUP"
        id_surat_tugas = kode_surat + "-" + katagori
        nomor_surat = "Usulan GUP"
        insert1 = {
            kode_surat             : kode_surat,
            kode_surat_header      : req.body.kode_surat_header,
            id_surat_tugas         : id_surat_tugas,
            deskripsi_usulan       : req.body.deskripsi_usulan,
            tanggal_usulan         : req.body.tanggal_usulan,
            kode_unit              : req.body.kode_unit,
            jenis_belanja          : req.body.jenis_belanja,
            katagori               : req.body.katagori,
            nomor_surat            : nomor_surat,
            tanggal_surat          : req.body.tanggal_surat,
            perihal                : req.body.perihal,
            tahun                  : req.body.tahun,
            kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
            kode_aktivitas_rkatu   : req.body.kode_aktivitas_rkatu,
            kode_rka               : req.body.kode_rka,
            kode_periode           : req.body.kode_periode,
            total_biaya            : req.body.total_biaya,
            id_user                : req.body.id_user,
            ucr                    : req.body.ucr
        }
        return db.transaction()
    })
    .then(async(t) => {
        let tokenpevita = await pevita.token()
        let payload = [{
            id: 1,
            jenisSurat: "spp"
        },
        {
            id: 2,
            jenisSurat: "sptb"
        }];
        
        payload.map((val) => {
                let data_pev = pevita.generateNomor(
                insert1.id_surat_tugas, 
                insert1.katagori,
                insert1.kode_unit,
                parseInt(insert1.tahun),
                val.jenisSurat,
                "B",
                11,
                3,
                "Surat Uang Persediaan " + insert1.katagori,
                545,
                75,
                insert1.id_user,
                insert1.ucr,
                insert1.tanggal_surat,
                tokenpevita,
                val.id
            )
        }, {transaction : t});
        return RefUsulanGup.create(insert1,{transaction : t})
        .then((appCreate) => {
            if(!appCreate) {
                const error = new Error("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            request = req.body;
            data = request.DaftarPengadaan.map((item) => {
                return {
                    kode_surat      : kodemax,
                    no_pengadaan  : item.no_pengadaan,
                    nama_pengadaan: item.nama_pengadaan,
                    nama_penyedia : item.nama_penyedia,
                    jenis_belanja : item.jenis_belanja,
                    total_biaya   : item.total_biaya,
                    foto_bukti    : item.foto_bukti,
                    ucr           : item.ucr
                }
            }); 
            return RefDaftarPengadaan.bulkCreate(data, {
                transaction : t
            });
        })
        .then((appBulk1) => {
            if(!appBulk1) {
                const error = new Error ("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            data1 = request.DaftarPengadaan.map((item) => {
                return item.DetailPengadaan.map((cekitem) => {
                    return {
                        no_pengadaan: cekitem.no_pengadaan,
                        deskripsi   : cekitem.deskripsi,
                        harga_satuan: cekitem.harga_satuan,
                        volume      : cekitem.volume,
                        ppn         : cekitem.ppn,
                        pph         : cekitem.pph,
                        total_harga : cekitem.total_harga,
                        ucr         : cekitem.ucr
                    }
                })
            })
            
            let flatdata1 = data1.flat()
            return RefDetailPengadaan.bulkCreate(flatdata1, {
                transaction : t
            });
        })
        .then((appBulk2) => {
            if(!appBulk2) {
                const error = new Error("Data Gagal Masuk")
                error.statusCode = 422
                throw error
            }
            t.commit();
        })
        .catch((err) => {
            t.rollback()
            throw err
        });
    })
    .then(() => {
        return dokumenKirimPanutan.findAll({
            where : {
                id_surat_tugas : insert1.id_surat_tugas
            }
        })
        .then((appGet) => {
            return jsonFormat(res, 'success', 'Data Berhasil Ditampilkan', insert1.id_surat_tugas   )
        })
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.store = (req, res, next) => {
    let kodemax;
    let id_surat_tugas; 
    let insert1;
    let nomor_surat;
    let request;
    let data;
    let data1;
    let flatdata1;
    let flatdata2;
    let data2;
    return db.transaction()
    .then((t) => {
        return RefUsulanGup.max('kode_surat')
        .then((max) => {
            let kode_surat = max + 1
            kodemax = kode_surat
            let katagori = "G"
            id_surat_tugas = kode_surat + "-" + katagori
            nomor_surat = "G"
            insert1 = {
                kode_surat             : kode_surat,
                kode_surat_header      : req.body.kode_surat_header,
                id_surat_tugas         : id_surat_tugas,
                deskripsi_usulan       : req.body.deskripsi_usulan,
                tanggal_usulan         : req.body.tanggal_usulan,
                jenis_belanja          : req.body.jenis_belanja,
                katagori               : katagori,
                nomor_surat            : nomor_surat,
                kode_unit              : req.body.kode_unit,
                tanggal_surat          : req.body.tanggal_surat,
                perihal                : req.body.perihal,
                tahun                  : req.body.tahun,
                kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
                nama_kegiatan_ut_detail: req.body.nama_kegiatan_ut_detail,
                kode_aktivitas_rkatu   : req.body.kode_aktivitas_rkatu,
                nama_aktivitas_rkatu   : req.body.nama_aktivitas_rkatu,
                kode_rka               : req.body.kode_rka,
                kode_periode           : req.body.kode_periode,
                total_biaya            : req.body.total_biaya,
                ucr                    : req.body.ucr,
                status_posisi          : req.body.status_posisi
            }
            return RefUsulanGup.create(insert1, {transaction : t});
        })
        .then((appCreate) => {
            if(!appCreate) {
                const error = new Error("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            request = req.body;
            data = request.DaftarPengadaan.map((item) => {
                return {
                    kode_surat            : kodemax,
                    id_uang_persediaan  : item.id_uang_persediaan,
                    nama_permintaan_up  : item.nama_permintaan_up,
                    nama_penyedia       : item.nama_penyedia,
                    jenis               : item.jenis,
                    kriteria            : item.kriteria,
                    total               : item.total,
                    tanggal             : item.tanggal,
                    status_permintaan_up: item.status_permintaan_up,
                    keterangan          : item.keterangan,
                    ucr                 : item.ucr
                }
            }); 
            return RefDaftarPengadaan.bulkCreate(data, {
                transaction : t
            });
        })
        .then((appBulk1) => {
            if(!appBulk1) {
                const error = new Error ("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            data1 = request.DaftarPengadaan.map((item) => {
                return item.detail.map((cekitem) => {
                    return {
                        id_uang_persediaan: cekitem.id_uang_persediaan,
                        deskripsi         : cekitem.deskripsi,
                        harga_satuan      : cekitem.harga_satuan,
                        satuan_ukuran     : cekitem.satuan_ukuran,
                        total_harga       : cekitem.total_harga,
                        ucr               : cekitem.ucr
                    }
                })
            })
            
            flatdata1 = data1.flat()
            return RefDetailPengadaan.bulkCreate(flatdata1, {
                transaction : t
            });
        })
        .then((appBulk2) => {
            if(!appBulk2) {
                const error = new Error("Data Gagal Masuk")
                error.statusCode = 422
                throw error
            }
            data2 =  request.DaftarPengadaan.map((item) => {
                return item.bukti.map((cekitem) => {
                    return {
                        id_uang_persediaan: cekitem.id_uang_persediaan,
                        nama_bukti  : cekitem.nama,
                        bukti       : cekitem.bukti,
                        ucr         : cekitem.ucr
                    }
                })
            })
            flatdata2 = data2.flat()
            return RefDetailFoto.bulkCreate(flatdata2, {transaction : t})
        })
        .then((appBulk3) => {
            if(!appBulk3) {
                const error = new Error("Data Gagal Insert")
                error.statusCode = 422
                throw error
            }
            t.commit()
        })
        .catch((err) => {
            t.rollback()
            throw err
        });
    })
    .then(() => {
        return jsonFormat(res, 'success', 'Data Berhasil Ditambah', insert1)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.updateKomentar = (req, res, next) => {
    let param = {
        kode_surat : req.params.id
    }
    let body = {
        status_posisi : req.body.status_posisi, 
        komentar : req.body.komentar
    }

    return RefUsulanGup.findAll({
        where : param
    })
    .then((app) => {
        if(app.length === 0) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return RefUsulanGup.update(body, {
            where : param
        });
    })
    .then((appUpdate) => {
        if(!appUpdate) {
            const error = new Error("Data Gagal Update")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Berhasil Merubah Status Surat', body)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.getNomorSurat = (req ,res, next) => {
    const param = {
        kode_surat : req.params.id
    }
    const body = {
        id_user : req.body.id_user, 
        ucr : req.body.ucr
    }

    let data_kirim;

    return RefUsulanGup.findAll({
        where : param, 
        attributes : {exclude : ['udcr','udch','ucr','uch']},
        raw : true
    })
    .then((app) => {
        let data = app[0]
        data_kirim = {
            id_surat_tugas : data.id_surat_tugas, 
            katagori : data.katagori, 
            kode_unit : data.kode_unit, 
            tahun : data.tahun, 
            id_user : body.id_user, 
            ucr : body.ucr,
            tanggal_surat : data.tanggal_surat
        }
        return data_kirim
    })
    .then(async(kirim) => {
        let tokenpevita = await pevita.token()
        let payload = [{
            id: 1,
            jenisSurat: "spp"
        },
        {
            id: 2,
            jenisSurat: "sptb"
        }]
        console.log(kirim.id_surat_tugas)
        payload.map((val) => {
            let data_pev = pevita.generateNomor(
                kirim.id_surat_tugas, 
                kirim.katagori,
                kirim.kode_unit,
                parseInt(kirim.tahun),
                val.jenisSurat,
                "B",
                11,
                3,
                "Surat Uang Persediaan " + kirim.katagori,
                545,
                75,
                kirim.id_user,
                kirim.ucr,
                kirim.tanggal_surat,
                tokenpevita,
                val.id
            );
        })
    })
    .then((panutan) => {
        return jsonFormat(res, 'success', 'Berhasil Membuat Nomor', data_kirim.id_surat_tugas)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}

exports.showNoSurat = (req, res, next) => {
    let param = {
        id_surat_tugas : req.params.id
    }

    return RefUsulanGup.findAll({
        where : param, 
        include : [
            {
                model : dokumenKirimPanutan,
                as : 'DokumenPanutan',
                where : param 
            }
        ]
    })
    .then((app) => {
        return jsonFormat(res, 'success', "Berhasil Menampilkan Nomor Surat", app)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}



exports.detailPengadaanView = (req, res, next) => {
    const param = {
        no_pengadaan : req.params.no_pengadaan
    }

    return RefDaftarPengadaan.findOne({
        where : param, 
        attributes : {exclude : ['ucr', 'udcr', 'udch', 'uch']},
        include : [
            {
                model : RefDetailPengadaan,
                attributes : {exclude : ['ucr', 'udcr', 'udch', 'uch']}
            }
        ]
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Berhasil Menampilkan Data', app)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
}


exports.updateRka = (req, res, next) => {
    const param = {
        kode_surat : req.params.id
    }

    const data = {
        kode_kegiatan_ut_detail : req.body.kode_kegiatan_ut_detail, 
        nama_kegiatan_ut_detail : req.body.nama_kegiatan_ut_detail, 
        kode_aktivitas_rkatu : req.body.kode_aktivitas_rkatu, 
        nama_aktivitas_rkatu : req.body.nama_aktivitas_rkatu
    }

    return RefUsulanGup.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return RefUsulanGup.update(data, {
            where : param
        });
    })
    .then((appUpd) => {
        if(!appUpd) {
            const error = new Error("Data Gagal Update")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Data Berhasil Dimasukkan', data)
    })
    .catch((err) => { 
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        return next(err);
    });
} 