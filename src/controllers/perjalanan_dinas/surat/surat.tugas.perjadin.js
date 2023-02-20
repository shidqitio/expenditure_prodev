const debug = require("log4js");
const logger = debug.getLogger();
const db = require("../../../config/database");
const { Op, fn, col, literal } = require('sequelize');
const { jsonFormat } = require("../../../utils/jsonFormat");
const SuratExpenditure = require("../../../models/surat_tugas/ref_surat_expenditure")
const SuratTugasPerjadin = require("../../../models/surat_tugas/ref_surat_tugas_perjadin_awal");
const PerjalananPerjadin = require("../../../models/surat_tugas/ref_perjalanan_petugas_awal")
const PetugasPerjadin = require("../../../models/surat_tugas/trx_petugas_perjadin_awal")
const Pemaraf = require("../../../models/surat_tugas/trx_pemaraf_surat_perjadin")
const Tembusan = require("../../../models/surat_tugas/trx_tembusan_surat")
const { generatePdf } = require("../../../utils/renderpdf");
const path = require("path");
const axios = require("axios");

exports.getSuratTugas = (req, res, next) => {
  // page & limit
  // ref_surat_tugas_perjadin_awal

  //( kode_surat_header ) nomor surat, sifat, rincian kegiatan, penandatangan, jenis perjalanan, status, aksi
  // filter ucr, petugas, tembusan, penandatangan, pemaraf by nip
  // status = draf, pengajuan = paraf, proses = sudah paraf , selesai = sudah tte, batal, revisi (BA)

  // FE
  // jika status = draf & ucr = nip maka ucr status = draf, role lain tidak ada listnya
  // jika status = pengajuan & pemaraf = nip maka pemaraf = status menunggu paraf & aksi paraf, role lain belum paraf
  // jika status = proses maka status semua role sudah paraf
  // jika status = selesai maka status semua role sudah tte
  // jika status = batal & ucr = nip maka semua role batal
  // jika status = revisi maka semua role revisi

  const nip = req.get("CLIENT-ID");
  if (!nip) {
    let error = new Error("client id kosong");
    error.statusCode = 422;
    throw error;
  }

  if(req.query.page){
    let page = req.query.page;
    let limit = 10;
    let offset = 0;

    if (typeof page === "string") {
      page = parseInt(page);
    }

    if (req.query.limit) {
      limit = req.query.limit;
    }

    if (page > 1) {
      const p = page - 1;
      offset = limit * p + 1;
    }

    SuratExpenditure.findAll({
      where: {
        jenis_surat: "ref_surat_tugas_perjadin_awal",
        [Op.or]: [
          {
            [Op.and]: [
              {
                "$SuratTugasPerjadin.ucr$": {
                  [Op.eq]: nip,
                },
              },
              {
                "$SuratTugasPerjadin.status$": {
                  [Op.eq]: "DRAF",
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                "$SuratTugasPerjadin.status$": {
                  [Op.not]: "DRAF",
                },
              },
              {
                [Op.or]: [
                  {
                    "$SuratTugasPerjadin.PerjalananPerjadin.PetugasPerjadin.nip$":
                      {
                        [Op.eq]: nip,
                      },
                  },
                  {
                    "$Pemaraf.nip$": {
                      [Op.eq]: nip,
                    },
                  },
                  {
                    "$Tembusan.nip$": {
                      [Op.eq]: nip,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      attributes: {
        exclude: ["kode_surat_relasi", "ucr", "uch", "udcr", "udch"],
      },
      include: [
        {
          model: SuratTugasPerjadin,
          as: "SuratTugasPerjadin",
          attributes: {
            exclude: ["uch", "udcr", "udch"],
          },
          include: [
            {
              model: PerjalananPerjadin,
              as: "PerjalananPerjadin",
              attributes: {
                exclude: ["ucr", "uch", "udcr", "udch"],
              },
              include: {
                model: PetugasPerjadin,
                as: "PetugasPerjadin",
              },
            },
          ],
        },
        {
          model: Pemaraf,
          as: "Pemaraf",
        },
        {
          model: Tembusan,
          as: "Tembusan",
        },
      ],
      limit: limit,
      offset: offset
    })
      .then((suratTugas) => {
        res.json({
          total: suratTugas.length,
          code: 200,
          status: "success",
          data: suratTugas,
        });
      })
      .catch((err) => {
        next(err);
      });
  }else{
    SuratExpenditure.findAll({
      where: {
        jenis_surat: "ref_surat_tugas_perjadin_awal",
        [Op.or]: [
          {
            [Op.and]: [
              {
                "$SuratTugasPerjadin.ucr$": {
                  [Op.eq]: nip,
                },
              },
              {
                "$SuratTugasPerjadin.status$": {
                  [Op.eq]: "DRAF",
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                "$SuratTugasPerjadin.status$": {
                  [Op.not]: "DRAF",
                },
              },
              {
                [Op.or]: [
                  {
                    "$SuratTugasPerjadin.PerjalananPerjadin.PetugasPerjadin.nip$":
                      {
                        [Op.eq]: nip,
                      },
                  },
                  {
                    "$Pemaraf.nip$": {
                      [Op.eq]: nip,
                    },
                  },
                  {
                    "$Tembusan.nip$": {
                      [Op.eq]: nip,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      attributes: {
        exclude: ["kode_surat_relasi", "ucr", "uch", "udcr", "udch"],
      },
      include: [
        {
          model: SuratTugasPerjadin,
          as: "SuratTugasPerjadin",
          attributes: {
            exclude: ["uch", "udcr", "udch"],
          },
          include: [
            {
              model: PerjalananPerjadin,
              as: "PerjalananPerjadin",
              attributes: {
                exclude: ["ucr", "uch", "udcr", "udch"],
              },
              include: {
                model: PetugasPerjadin,
                as: "PetugasPerjadin",
              },
            },
          ],
        },
        {
          model: Pemaraf,
          as: "Pemaraf",
        },
        {
          model: Tembusan,
          as: "Tembusan",
        },
      ],
    })
      .then((suratTugas) => {
        res.json({
          total: suratTugas.length,
          code: 200,
          status: "success",
          data: suratTugas,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
}

exports.createSuratTugas = async (req, res, next) => {
  const sifat_surat = req.body.sifat_surat // required
  const jenis_perjalanan = req.body.jenis_perjalanan // required
  const klasifikasi_surat = req.body.klasifikasi_surat // required
  const kode_unit = req.body.kode_unit // required
  const kode_unit_pagu = req.body.kode_unit_pagu // required
  const keperluan = req.body.keperluan // optional
  const nip_penandatangan = req.body.nip_penandatangan // required
  const email_penandatangan = req.body.email_penandatangan // required
  const tanggal_surat = req.body.tanggal_surat // required
  const status = req.body.status; // required
  const data_pengusulan = req.body.data_pengusulan // required
  const rincian_kegiatan = req.body.rincian_kegiatan;
  const dokumen = req.body.dokumen;  
  const perjalananDanPetugas = JSON.parse(req.body.perjalanan); // required
  const pemaraf = JSON.parse(req.body.pemaraf); // optional
  const tembusan = JSON.parse(req.body.tembusan); // optional
  const ucr = req.body.ucr // required
  // komentar

  // -> draf/pengajuan (create surat)
  // draf -> batal/pengajuan (delete surat & update status)
  // batal
  // pengajuan -> paraf/tte/batal
  // selesai -> (api panutan tte & update status)
  // list (get all surat)

  // jika user proses draf (done)
  // buat surat expenditure (done)
  // buat surat tugas perjadin awal (done)
  // buat perjalanan (done)
  // buat petugas (done)
  // buat pemaraf (done)
  // buat tembusan (done)
  // buat komentar

  // cek jadwal
   return db.transaction().then(async (t) => {
      let kodeHeader;

      // const userDataPromise = perjalananDanPetugas.map((perjalanan) => {
      // const arrPetugas = perjalanan.petugas.map((petugas) => {
      //   return {
      //     nama: petugas.nama_petugas,
      //     email: petugas.email,
      //   };
      // });

      // const data = {
      //   tanggal_awal: perjalanan.tanggal_pergi,
      //   tanggal_akhir: perjalanan.tanggal_pulang,
      //   data_petugas: arrPetugas,
      // };

      //   return axios.post(
      //     `https://prodev.ut.ac.id:9443/nadinetest/public/api/expenditure/cek-agenda-banyak-petugas`,
      //     data
      //   );
      // });

      // const userData = await Promise.all(userDataPromise);
      // const userDataMapped = userData.map((response) => response.data);
     

      // if(userDataMapped){
      // userDataMapped.map(response => {
      //   if(response.status !== "success"){
      //     let error = new Error("gagal membuat surat_expenditure");
      //     error.statusCode = 422;
      //     throw error
      //   }else{
      //   let result = []
      //   response.data.map(item => {
      //     if(item.message !== "Tidak ada agenda"){
      //       // ada jadwal
      //       result.push({
      //         message: "ada yang bentrok",
      //         email: item.email
      //       })
      //     }
      //   })

      //   let error = new Error("gagal membuat surat_expenditure");
      //   error.statusCode = 422;
      //   error.message = result
      //   throw error;
      //   }
      // })
      // }

      return SuratExpenditure.create({
        jenis_surat: "ref_surat_tugas_perjadin_awal"
      },{
        transaction: t
      })
        .then((newSuratExp) => {
         if(!newSuratExp){
            let error = new Error("gagal membuat surat_expenditure");
            error.statusCode = 422;
            throw error
         }
         return SuratExpenditure.max("kode_surat_header", {transaction: t});
        })
        .then(async(maxId) => {
          if (!maxId){
            let error = new Error("gagal mendapatkan max id surat exp");
            error.statusCode = 422;
            throw error;
          }

          const link_path = await generatePdf(dokumen, ucr);
          if(!link_path){
            let error = new Error("gagal membuat pdf");
            error.statusCode = 422;
            throw error;
          }

          kodeHeader = maxId
          return SuratTugasPerjadin.create(
            {
              kode_surat_header: maxId,
              sifat_surat: sifat_surat,
              nomor_surat_tugas: "-",
              jenis_perjalanan: jenis_perjalanan,
              klasifikasi_surat: klasifikasi_surat,
              kode_unit: kode_unit,
              kode_unit_pagu: kode_unit_pagu,
              keperluan: keperluan,
              rincian_kegiatan: rincian_kegiatan,
              nip_penandatangan: nip_penandatangan,
              email_penandatangan: email_penandatangan,
              link_path: link_path,
              status: status,
              data_pengusulan: data_pengusulan,
              tanggal_surat_tugas: tanggal_surat,
              ucr: ucr,
            },
            {
              transaction: t,
            }
          );
        })
        .then((newSurtug) => {
            if(!newSurtug){
                let error = new Error("gagal membuat surat tugas");
                error.statusCode = 422;
                throw error;
            }
         return SuratTugasPerjadin.max("kode_surat_tugas", {
           transaction: t,
         });
        })
        .then((maxKodeSurtug) => {
          if (!maxKodeSurtug) {
            let error = new Error("gagal mendapatkan max kode surtug");
            error.statusCode = 422;
            throw error;
          } 

          return Promise.all(perjalananDanPetugas.map(penugasan => {
            return PerjalananPerjadin.create({
              kode_surat_tugas: maxKodeSurtug,
              kode_tempat_asal: penugasan["kode_tempat_asal"],
              kode_tempat_tujuan: penugasan["kode_tempat_tujuan"],
              tanggal_pergi: penugasan["tanggal_pergi"],
              tanggal_pulang: penugasan["tanggal_pulang"],
              detail_lokasi: penugasan["detail_lokasi"],
              keterangan_penugasan: penugasan["keterangan_penugasan"],
              ucr: ucr
            },{
                transaction: t
            }).then((result) => {
               if (!result) {
                 let error = new Error("gagal membuat perjalanan");
                 error.statusCode = 422;
                 throw error;
               } 

                return Promise.all(penugasan.petugas.map((petugas) => {
                    return PetugasPerjadin.create(
                      {
                        kode_perjalanan: result.kode_perjalanan,
                        nip: petugas["nip"],
                        nama_petugas: petugas["nama_petugas"],
                        email: petugas["email"],
                        id_petugas: petugas["id_petugas"],
                        eselon: petugas["eselon"],
                        gol: petugas["gol"],
                        kode_bank: petugas["kode_bank"],
                        nomor_rekening: petugas["nomor_rekening"],
                        atas_nama_rekening: petugas["atas_nama_rekening"],
                      },
                      {
                        transaction: t,
                      }
                    );
                  })
                )
            })
          }))
        })
        .then(() => {
            if(pemaraf){
                return Promise.all(pemaraf.map(list => {
                    return Pemaraf.create({
                        kode_surat_header: kodeHeader,
                        nip: list["nip"],
                        id_petugas: list["id_petugas"],
                        email: list["email"],
                        status: "BELUM PARAF"
                    },{
                        transaction: t
                    })
                }))
            }else {
                return Promise.resolve()
            }
        })
        .then(() => {
          if (tembusan) {
            return Promise.all(
              tembusan.map((list) => {
                return Tembusan.create(
                  {
                    kode_surat_header: kodeHeader,
                    nip: list["nip"],
                    id_petugas: list["id_petugas"],
                    email: list["email"],
                    aktif: "AKTIF",
                  },
                  {
                    transaction: t,
                  }
                );
              })
            );
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
            t.commit()
            // return data yang ingin ditampilkan
        })
        .catch((err) => {
            t.rollback();
            throw err;
        });
   }).then((response) => {
      res.json({
        code: 201,
        status: "success",
        message: "berhasil membuat surat"
      })
   }).catch(err => {
      next(err)
   })
}

exports.getSuratTugasById = (req, res, next) => {
    // detail surat
    const kode = req.body.kode;

    SuratTugasPerjadin.findOne({
      where: {
        kode_surat_tugas: kode,
      },
      include: [
        {
          model: PerjalananPerjadin,
          as: "PerjalananPerjadin",
          include: {
            model: PetugasPerjadin,
            as: "PetugasPerjadin",
          },
        },
      ],
    })
      .then((suratTugas) => {
        res.json({
          code: 200,
          status: "success",
          data: suratTugas,
        });
      })
      .catch((err) => {
        next(err);
      });
}

exports.parafSurat = (req, res, next) => {
    // paraf
    // cek urutan pemaraf
    const nip = req.body.nip;
    const kode_surat_header = req.body.kode_surat_header;

    return db.transaction().then(t => {
      return Pemaraf.findOne({
        where: {
          kode_surat_header: kode_surat_header,
          nip: nip,
          status: "SUDAH PARAF",
        },
      })
        .then((pemaraf) => {
          if (pemaraf) {
            let error = new Error("user sudah paraf");
            error.statusCode = 422;
            throw error;
          }

          return Pemaraf.findAll({
            where: {
              kode_surat_header: kode_surat_header,
              status: "BELUM PARAF",
            },
            order: [["kode_pemaraf", "ASC"]],
            limit: 1,
          });
        })
        .then((exPemaraf) => {
          if (exPemaraf[0].nip !== nip) {
            let error = new Error("belum waktunya paraf");
            error.statusCode = 422;
            throw error;
          }

          return Pemaraf.update(
            {
              status: "SUDAH PARAF",
            },
            {
              where: {
                nip: nip,
                status: "BELUM PARAF",
                kode_surat_header: kode_surat_header,
              },
            }
          );
        })
        .then((updated) => {
          if (!updated) {
            let error = new Error("gagal update paraf");
            error.statusCode = 422;
            throw error;
          }

          return SuratExpenditure.findOne({
            where: {
              kode_surat_header: kode_surat_header,
            },
            include: {
              model: Pemaraf,
              as: "Pemaraf",
              where: {
                status: "BELUM PARAF",
              },
            },
          });
        })
        .then((exUpdate) => {
          if (exUpdate) {
            return Promise.resolve();
          } else {
            // PROSES KIRIM KE PANUTAN
            return SuratTugasPerjadin.update(
              {
                status: "PROSES",
              },
              {
                where: {
                  kode_surat_header: kode_surat_header,
                },
              }
            );
          }
        })
        .then(() => {
          t.commit();
        })
        .catch((err) => {
          t.rollback();
          throw err;
        });
    })
    .then(() => {
       res.json({
          code: 201,
          status: "success",
          message: "berhasil update paraf"
        })
    })
    .catch(err => {
      next(err)
    })
}

exports.deleteSurat = (req, res, next) => {
 const kode_surat_header = req.body.kode_surat_header;

 return db.transaction().then(t => {
  return SuratTugasPerjadin.findOne({
    where: {
      status: "DRAF"
    },
    transaction: t
  })
  .then((exSuratExp) => {
    if(!exSuratExp){
      // batal
      // update status jadi revisi
      // lanjut proses bisnis
      return SuratTugasPerjadin.update({
        status: "REVISI"
      },{
        transaction: t
      })
    }else{
      return SuratTugasPerjadin.destroy({
        where: {
          kode_surat_header: kode_surat_header,
        },
        include: [
          {
            model: PerjalananPerjadin,
            as: "PerjalananPerjadin",
            include: {
              model: PetugasPerjadin,
              as: "PetugasPerjadin",
            },
          },
        ],
        transaction: t,
      }).then(() => {
        return SuratExpenditure.destroy({
          where: {
            kode_surat_header: kode_surat_header,
          },
          include: [
            {
              model: Pemaraf,
              as: "Pemaraf",
            },
            {
              model: Tembusan,
              as: "Tembusan",
            },
          ],
          transaction: t,
        });
      })
    }
  })
  .then(() => {
    t.commit()
  }).catch(err => {
    t.rollback()
    throw err
  })
 })
 .then(() => {
   res.json({
     code: 204,
     status: "success",
     message: "berhasil membatalkan surat",
   });
 })
 .catch(err => {
  next(err)
 })
}


// API UNTUK PANUTAN UPDATE STATUS
exports.updateStatusSuratTugas = () => {
  //
}