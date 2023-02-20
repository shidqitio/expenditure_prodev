const TrxSuratTugasBeasiswa = require("../../models/studi_lanjut/trx_surat_tugas_beasiswa")
const TrxKomponenBeasiswa = require("../../models/studi_lanjut/trx_komponen_beasiswa")
const hostExpenditure = process.env.hostExpenditure;
const pevita = require("../../utils/pevita")
const renderpdf = require("../../utils/renderpdf")
const db = require("../../config/database");
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan");
const siakun = require("../../middleware/siakun")


const { jsonFormat } = require("../../utils/jsonFormat");

exports.index = (req ,res, next) => {
    TrxSuratTugasBeasiswa.findAll({
        include : [
            {
                model : dokumenKirimPanutan, 
                as : 'DokumenPanutan',
                attributes : ["nomor", "kode_unit"]
            }
        ],
        order : [
            ['kode_surat', 'DESC']
        ]
    })
    .then((app) => {
        return jsonFormat(res, 'success', 'Data Berhasil Ditampilkan',app)
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}


exports.store = async (req, res, next) => {
    let kodemax
    let nomor_surat
    let id_surat_tugas
    let insert1
    let data

    return db.transaction ()
    .then((t) => {
        return TrxSuratTugasBeasiswa.max('kode_surat').then((max) => {
            let kode_surat = max + 1
            kodemax = kode_surat
            let katagori = "Beasiswa"
            id_surat_tugas = kode_surat + "-" + katagori
            nomor_surat = "Beasiswa"
            let total_pph = req.body.total_pph
            let total_diterima = req.body.total_diterima
            let total_be = total_pph + total_diterima
            insert1 = {
                kode_surat               : kode_surat,
                kode_surat_header : req.body.kode_surat_header,
                no_surat_keputusan     : req.body.no_surat_keputusan,
                id_surat_tugas         : id_surat_tugas,
                nama_usulan            : req.body.nama_usulan,
                katagori               : katagori,
                nomor_surat            : nomor_surat,
                tanggal_surat          : req.body.tanggal_surat,
                perihal                : req.body.perihal,
                kode_unit              : req.body.kode_unit,
                tahun                  : req.body.tahun,
                jenjang                : req.body.jenjang,
                klasifikasi            : req.body.klasifikasi,
                kode_kegiatan_ut_detail: req.body.kode_kegiatan_ut_detail,
                kode_aktivitas_rkatu   : req.body.kode_aktivitas_rkatu,
                kode_rka               : req.body.kode_rka,
                kode_periode           : req.body.kode_periode,
                id_user                : req.body.id_user,
                total_pph              : req.body.total_pph,
                total_diterima         : req.body.total_diterima,
                total_beasiswa         : total_be,
                ucr                    : req.body.ucr,
            }
            
            return TrxSuratTugasBeasiswa.create(insert1, {transaction : t});
        })
        .then(async(appCreate) => {
            if(!appCreate) {
                const error = new Error ("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            const request = req.body;
            data = request.tkomponen.map((item) => {
                return {
                    kode_surat            : kode_surat,
                    nip                 : item.nip,
                    nama_pegawai        : item.nama_pegawai,
                    keterangan          : item.keterangan,
                    golongan            : item.golongan,
                    biaya_pendaftaran   : item.biaya_pendaftaran,
                    biaya_spp           : item.biaya_spp,
                    dana_hidup          : item.dana_hidup,
                    tunjangan_buku      : item.tunjangan_buku,
                    tunjangan_keluarga  : item.tunjangan_keluarga,
                    dana_transportasi   : item.dana_transportasi,
                    dana_kedatangan     : item.dana_kedatangan,
                    dana_keadaan_darurat: item.dana_keadaan_darurat,
                    bantuan_penelitian  : item.bantuan_penelitian,
                    bantuan_seminar     : item.bantuan_seminar,
                    bantuan_publikasi   : item.bantuan_publikasi,
                    pph                 : item.pph,
                    jumlah_diterima     : item.jumlah_diterima
                }
            });

            return TrxKomponenBeasiswa.bulkCreate(data, {
                transaction : t
            });
        })
        .then(async(appBulk) => {
            if(!appBulk) {
                const error = new Error ("Data Gagal Tambah")
                error.statusCode = 422
                throw error
            }
            t.commit();
        })
        .catch((err) => {
            t.rollback()
            throw err
        })
    })
    .then(async(nomor) => {
        let tokenpevita = await pevita.token()
          
            let payload = [{
                id: 1,
                jenisSurat: "spp"
            },
            {
                id: 2,
                jenisSurat: "sptb"
            },
            {
                id: 3,
                jenisSurat: "nominatif"
            }];
            
            payload.map(async(val) => {
                const prev = await pevita.generateNomor(
                    insert1.id_surat_tugas, 
                    insert1.katagori,
                    insert1.kode_unit,
                    parseInt(insert1.tahun),
                    val.jenisSurat,
                    "B",
                    11,
                    3,
                    "Surat Beasiswa " + insert1.katagori,
                    545,
                    75,
                    insert1.id_user,
                    insert1.ucr,
                    insert1.tanggal_surat,
                    tokenpevita,
                    val.id
                )
            });
    })
    .then((panutan) => {
        return jsonFormat(res, 'success', 'Nomor Surat Berhasil di Generate', insert1.id_surat_tugas)
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.showByNoSurat = (req, res, next) => {
    let param = {
        id_surat_tugas : req.params.id
    }
    return TrxSuratTugasBeasiswa.findAll({
        where : param,
        include : [
            {
                model : dokumenKirimPanutan,
                as : 'DokumenPanutan',
                attributes : ['id_surat_tugas','nomor','jenis_surat']
            },
            {
                model : TrxKomponenBeasiswa, 
                as : 'TrxKomponenBeasiswa',
                attributes : {
                    exclude : ['udcr','udch','ucr','uch']
                }
            }
        ],
    })
    .then((app) => {
        if(app.length === 0) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        let data_app = JSON.parse(JSON.stringify(app))
        let index = data_app.length
        let {tahun} = data_app[index-1]
        let {kode_periode} = data_app[index-1]
        let {id_surat_tugas} = data_app[index-1]
        let {tanggal_surat} = data_app[index-1]
        let {kode_rka} = data_app[index-1]
        let {total_diterima} = data_app[index-1]
        let {ucr} = data_app[index-1]
        let nomor_surat_tugas = data_app[0].DokumenPanutan[0].nomor
        console.log(data_app)
        console.log(kode_rka)
        siakun.storePagu(
            tahun, 
            "M08.01.04",
            id_surat_tugas,
            tanggal_surat,
            nomor_surat_tugas,
            kode_rka,
            kode_periode,
            total_diterima,
            ucr
        )

        return app
    })
    .then((tampil) => {
        if(!tampil) {
            const error = new Error("Data Gagal Mengurangi RKA")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', "Data Berhasil Ditampilkan", tampil[0] )
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}


exports.showNoSurat = (req, res, next) => {
    let param = {
        id_surat_tugas : req.params.id
    }
    return TrxSuratTugasBeasiswa.findAll({
        where : param,
        include : [
            {
                model : dokumenKirimPanutan,
                as : 'DokumenPanutan',
                attributes : ['id_surat_tugas','nomor','jenis_surat']
            },
            {
                model : TrxKomponenBeasiswa, 
                as : 'TrxKomponenBeasiswa',
                attributes : {
                    exclude : ['udcr','udch','ucr','uch']
                }
            }
        ]
    })
    .then((app) => {
        if(app.length === 0) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Data Berhasil Ditampilkan', app[0])
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.updatekomponen = (req, res, next) => {
    const param = {
        kode_trx_komponen_beasiswa : req.params.id
    }
    const body = {
        nip                 : req.body.nip,
        nama_pegawai        : req.body.nama_pegawai,
        keterangan          : req.body.keterangan,
        golongan            : req.body.golongan,
        biaya_pendaftaran   : req.body.biaya_pendaftaran,
        biaya_spp           : req.body.biaya_spp,
        dana_hidup          : req.body.dana_hidup,
        tunjangan_buku      : req.body.tunjangan_buku,
        tunjangan_keluarga  : req.body.tunjangan_keluarga,
        dana_transportasi   : req.body.dana_transportasi,
        dana_kedatangan     : req.body.dana_kedatangan,
        dana_keadaan_darurat: req.body.dana_keadaan_darurat,
        bantuan_penelitian  : req.body.bantuan_penelitian,
        bantuan_seminar     : req.body.bantuan_seminar,
        bantuan_publikasi   : req.body.bantuan_publikasi,
        pph                 : req.body.pph,
        jumlah_diterima     : req.body.jumlah_diterima
    }
    return TrxKomponenBeasiswa.findOne({
        where : param
    })
    .then((app) => {
        if(!app) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return TrxKomponenBeasiswa.update(body, {
            where : param
        });
    })
    .then((appUpd) => {
        if(!appUpd) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        }
        return jsonFormat(res, 'success', 'Data Berhasil Diupdate', body)
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.getDokumen = (req, res, next) => {
    const param = {
        id_surat_tugas : req.params.id
    }

    return dokumenKirimPanutan.findAll({
        where : param,
        attributes : ['katagori_surat','id_surat_tugas','kode_unit','tahun','jenis_surat','nomor','id_file','link_file']
    })
    .then((app) => {
        if(app.length === 0) {
            const error = new Error("Data Tidak Ada")
            error.statusCode = 422
            throw error
        } 
        return jsonFormat(res, 'success','Berhasil Menampilkan Data', app)
    })
    .catch((err) => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
}