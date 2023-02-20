const debug = require("log4js");
const logger = debug.getLogger();
const db = require("../../../config/database");
const trxSbmPenginapan = require("../../../models/perjalanan_dinas/trx_sbm_penginapan");
const trxSbmTranspor = require("../../../models/perjalanan_dinas/trx_sbm_transpor");
const trxSbmUangharian = require("../../../models/perjalanan_dinas/trx_sbm_uangharian");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const { jsonFormat } = require("../../../utils/jsonFormat");

const perjadinCreate = (req, res, next) => {
  const data = req.body;
  const perjalanan = data.komponenPerjalanan;
  const petugas = data.komponenPetugas;
  const sbmTranspor = data.sbmTranspor;
  const sbmPenginapan = data.sbmPenginapan;
  const sbmUangharian = data.sbmUangharian;
  const payloadPerjalanan = [];
  const payloadPetugas = [];
  const payloadSbmPenginapan = [];
  const payloadSbmTranspor = [];
  const payloadSbmUangharian = [];

  const payloadHeader = {
    id_surat_tugas: data.idSuratTugas,
    tahun: data.tahun,
    kode_unit: data.kodeUnit,
    kode_kegiatan_ut_detail: data.kodeKegiatanUtDetail,
    kode_aktivitas_rkatu: data.kodeAktivitasRkatu,
    kode_rka: data.kodeRka,
    kode_periode: data.kodePeriode,
    akun_bas_rka: data.akunBasRka,
    akun_bas_realisasi: data.akunBasRealisasi,
    akun_bas_final: data.akunBasFinal,
    keperluan: data.keperluan,
    nomor_surat_tugas: data.nomorSuratTugas,
    nomor_spm: data.nomorSpm,
    tanggal_surat_tugas: data.tanggalSuratTugas,
    request_nomor_surat: data.requestNomorSurat,
    kode_skema: data.kodeSkema,
    kode_sub_unit: data.kodeSubUnit,
    kode_status: 3,
    data_pengusulan: data.dataPengusulan,
    jenis_kegiatan: data.jenisKegiatan,
    jenis_perjalanan: data.jenisPerjalanan,
    keterangan_perjadin: data.keterangan_perjadin,
    jumlah_orang: data.jumlahOrang,
    path_dokumen: data.pathDokumen,
    ucr: data.ucr,
  };

  perjalanan.forEach((values) => {
    payloadPerjalanan.push({
      kode_surat_tugas: values.kodeSuratTugas,
      nip: values.nip,
      keterangan_komponen: values.keteranganKomponen,
      kode_komponen_honor: values.kodeKomponenHonor,
      tahun: values.tahun,
      kode_kota_asal: values.kodeKotaAsal,
      kode_kota_tujuan: values.kodeKotaTujuan,
      tanggal_pergi: values.tanggalPergi,
      tanggal_pulang: values.tanggalPulang,
      kode_satuan: values.kodeSatuan,
      biaya_satuan: values.biayaSatuan,
      pajak_persen: values.pajakPersen,
      jumlah_pajak: values.jumlahPajak,
      jumlah_hari: values.jumlahHari,
      jumlah: values.jumlah,
      total: values.total,
    });
  });

  petugas.forEach((values) => {
    payloadPetugas.push({
      kode_surat_tugas: values.kodeSuratTugas,
      nip: values.nip,
      nama_petugas: values.namaPetugas,
      nama_bank: values.namaBank,
      kode_bank_asal: values.kodeBankAsal,
      nomor_rekening: values.nomorRekening,
      kode_bank_tujuan: values.kodeBankTujuan,
      nomor_rekening_tujuan: values.nomorRekeningDipakai,
      eselon: values.eselon,
      gol: values.gol,
      npwp: values.npwp,
      kode_kota_asal: values.kodeBankAsal,
      kode_kota_tujuan: values.kodeKotaTujuan,
      nama_kota_asal: values.namaKotaAsal,
      nama_kota_tujuan: values.namaKotaTujuan,
      kode_provinsi_asal: values.kodeProvinsiAsal,
      kode_provinsi_tujuan: values.kodeProvinsiTujuan,
      kode_unit_tujuan: values.kodeUnitTujuan,
      tanggal_pergi: values.tanggalPergi,
      tanggal_pulang: values.tanggalPulang,
      lama_perjalanan: values.lamaPerjalanan,
      transpor: values.transpor,
      biaya: values.biaya,
      keterangan_dinas: values.keteranganDinas,
      kekurangan_dan_pengembalian: values.kekuranganDanPengembalian,
      status_pengusulan: values.statusPengusulan,
      status_kurang_dan_lebih: values.statusKurangDanLebih,
      status_sppd: values.statusSppd,
    });
  });

  sbmTranspor.forEach((values) => {
    payloadSbmTranspor.push({
      "kode_surat_tugas": values.kodeSuratTugas,
      "nip": values.nip,
      "transport": values.transport,
      "keterangan": values.keterangan,
      "kategori": values.kategori,
      "mekanisme": values.mekanisme,
      "harga_satuan": values.hargaSatuan
    });
  });

  sbmPenginapan.forEach((values) => {
    payloadSbmPenginapan.push({
      "kode_surat_tugas": values.kodeSuratTugas,
      "nip": values.nip,
      "penginapan": values.penginapan,
      "keterangan_malam": values.keteranganMalam,
      "eselon": values.eselon,
      "golongan": values.golongan,
      "mekanisme": values.mekanisme,
      "harga_satuan": values.hargaSatuan
    });
  });

  sbmUangharian.forEach((values) => {
    payloadSbmUangharian.push({
      "kode_surat_tugas": values.kodeSuratTugas,
      "nip": values.nip,
      "kategori": values.kategori,
      "keterangan_hari": values.keteranganHari,
      "harga_satuan": values.hargaSatuan
    });
  });

  db.transaction()
    .then(async (t) => {
      return await SuratTugasPerjadin.create(payloadHeader, {
        transaction: t,
      })
        .then(async (result) => {
          if (!result) {
            jsonFormat(res, "failed", "Failed to record data Surat Tugas Perjadin!");
            logger.debug(`database SuratTugasPerjadin failed : ${result}`);
          }
          await KomponenPerjadin.bulkCreate(payloadPerjalanan, {transaction: t}).then(async (result) => {
              if (!result) {
                jsonFormat(res, "failed", "Failed to record data Komponen Perjadin!");
                logger.debug(`database KomponenPerjadin failed : ${result}`);
              }
              await PetugasPerjadin.bulkCreate(payloadPetugas, {transaction: t}).then(async(result) => {
                if (!result) {
                  jsonFormat(res, "failed", "Failed to record data Petugas Perjadin!");
                  logger.debug(`database PetugasPerjadin failed : ${result}`);
                }
                await trxSbmTranspor.bulkCreate(payloadSbmTranspor, {transaction: t}).then(async(result) => {
                  if (!result) {
                    jsonFormat(res, "failed", "Failed to record data payload Sbm Transpor!");
                    logger.debug(`database trxSbmTranspor failed : ${result}`);
                  }
                  await trxSbmPenginapan.bulkCreate(payloadSbmPenginapan, {transaction: t}).then(async(result) => {
                    if (!result) {
                      jsonFormat(res, "failed", "Failed to record data payload Sbm Penginapan!");
                      logger.debug(`database trxSbmPenginapan failed : ${result}`);
                    }
                    await trxSbmUangharian.bulkCreate(payloadSbmUangharian, {transaction: t}).then((result) => {
                      if (!result) {
                        jsonFormat(res, "failed", "Failed to record data payload Sbm Uang harian!");
                        logger.debug(`database trxSbmUangharian failed : ${result}`);
                      }
                      jsonFormat(res, "success", "Database success to recorded!");
                      t.commit();
                    }).catch((err) => {
                      logger.debug(`database trxSbmUangharian catch : ${err}`);
                      logger.error(`database trxSbmUangharian catch : ${err}`);
                      jsonFormat(res, "failed", {
                        responseCode: err.parent.errno,
                        responseMessage: err.parent.sqlMessage,
                      });
                      t.rollback();
                    })
                  }).catch((err) => {
                    logger.debug(`database trxSbmPenginapan catch : ${err}`);
                    logger.error(`database trxSbmPenginapan catch : ${err}`);
                    jsonFormat(res, "failed", {
                      responseCode: err.parent.errno,
                      responseMessage: err.parent.sqlMessage,
                    });
                    t.rollback();
                  });
                }).catch((err) => {
                  logger.debug(`database trxSbmTranspor catch : ${err}`);
                  logger.error(`database trxSbmTranspor catch : ${err}`);
                  jsonFormat(res, "failed", {
                    responseCode: err.parent.errno,
                    responseMessage: err.parent.sqlMessage,
                  });
                  t.rollback();
                });
              })
              .catch((err) => {
                logger.debug(`database PetugasPerjadin catch : ${err}`);
                logger.error(`database PetugasPerjadin catch : ${err}`);
                jsonFormat(res, "failed", {
                  responseCode: err.parent.errno,
                  responseMessage: err.parent.sqlMessage,
                });
                t.rollback();
              });
            })
            .catch((err) => {
              logger.debug(`database KomponenPerjadin catch : ${err}`);
              logger.error(`database KomponenPerjadin catch : ${err}`);
              jsonFormat(res, "failed", {
                responseCode: err.parent.errno,
                responseMessage: err.parent.sqlMessage,
              });
              t.rollback();
            });
        })
        .catch((err) => {
          logger.debug(`database SuratTugasPerjadin catch : ${err}`);
          logger.error(`database SuratTugasPerjadin catch : ${err}`);
          jsonFormat(res, "failed", {
            responseCode: err.parent.errno,
            responseMessage: err.parent.sqlMessage,
          });
          t.rollback();
        });
    })
    .catch((err) => {
      logger.debug(`database perjadinAssignments catch : ${err}`);
      logger.error(`database perjadinAssignments catch : ${err}`);
      next(err);
    });
};

module.exports = perjadinCreate;
