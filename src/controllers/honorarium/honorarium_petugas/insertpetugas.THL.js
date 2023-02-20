const petugasHonorarium = require("../../../models/trx_petugas_honorarium/trx_petugas_honorarium_all");
const SuratTugasHonor = require("../../../models/ref_surat_tugas_honor")
const { jsonFormat } = require("../../../utils/jsonFormat");
const db = require("../../../config/database")
const debug = require("log4js");
const logger = debug.getLogger();

const InsertPetugas = (req, res, next) => {
  db.transaction().then((t)=>{
  return SuratTugasHonor.max("kode_trx")
    .then((maxTrx) => {
      let dataSurat = {
        kode_trx: maxTrx + 1,
        kode_surat: maxTrx + 1 + "-THL-honorarium",
        tahun: req.body.tahun,
        id_surat_panutan: maxTrx + 1,
        id_sub_unit: req.body.id_sub_unit,
        nomor_surat: req.body.nomor_surat,
        tanggal_surat: req.body.tanggal_surat,
        kode_unit: req.body.kode_unit,
        perihal: req.body.perihal,
        penandatangan: req.body.penandatangan,
        kode_status: 1,
        data_pengusulan: req.body.data_pengusulan,
        jenis_honor: req.body.jenis_honor,
        nama_honor: "Honor Tenaga Harian Lepas",
        ucr: req.body.ucr,
      };
      return SuratTugasHonor.create(dataSurat, { transaction: t })
        .then((datacreate) => {
          console.log(datacreate);
          let arrDataPetugas = [];
          req.body.DataPetugas.map((petugas) => {
            let jumlah_biaya = 125000 * petugas.volume_1
            let dataPetugas = {
              kode_trx_surat: maxTrx + 1,
              kode_trx_pajak: 0,
              kode_trx_sbm: 810,
              kode_klasifikasi: req.body.kode_klasifikasi,
              nip: petugas.nip,
              kode_klasifikasi:"Honor Tenaga Harian Lepas",
              kode_surat: maxTrx + 1 + "-THL-honorarium",
              tahun: req.body.tahun,
              katagori: petugas.katagori,
              tugas: petugas.tugas,
              nama: petugas.nama,
              email: petugas.email,
              npwp: petugas.npwp,
              volume_1: petugas.volume_1,
              satuan_biaya: 125000,
              jumlah_biaya: 125000,
              pajak: 0,
              jumlah_diterima: jumlah_biaya,
              kode_bank: petugas.kode_bank,
              nama_bank: petugas.nama_bank,
              no_rekening: petugas.no_rekening,
              atas_nama_rekening: petugas.atas_nama_rekening,
              ucr: req.body.ucr,
            };
            arrDataPetugas.push(dataPetugas);
          });
          console.log(arrDataPetugas);
          return petugasHonorarium.bulkCreate(arrDataPetugas, {
            transaction: t,
          });
        })
        .then((createPetugas) => {
          t.commit();
          return jsonFormat(res, "success", "Berhasil", createPetugas);
        });
    })
    .catch((err) => {
      t.rollback();
      throw err;
    });
  }).catch((err)=>{
  logger.debug(`database InsertPetugasTHL catch : ${err}`);
  logger.error(`database InsertPetugasTHL catch : ${err}`);
  next(err);
  })
};

module.exports = InsertPetugas;
