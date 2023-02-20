const debug = require("log4js");
const logger = debug.getLogger();
const db = require("../../../config/database");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const { jsonFormat } = require("../../../utils/jsonFormat");

const perjadinUpdate = (req, res, next) => {
   const data = req.body;
   const perjalanan = data.komponenPerjalanan;
   const petugas = data.komponenPetugas;
   const payloadPerjalanan = [];
   const payloadPetugas = [];

   jsonFormat(res, "success", "jangan di coba lagi galau", [
     "kamu nanya kamu bertanya-tanya!",
   ]);
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
     kode_status: data.kodeStatus,
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
       kode_trx: data.kodeTrx,
       kode_surat_tugas: values.kodeSuratTugas,
       id_petugas: values.idPetugas,
       nip: values.nip,
       keterangan_komponen: values.keteranganKomponen,
       kode_komponen_honor: values.kodeKomponenHonor,
       tahun: values.tahun,
       kode_kota_asal: values.kodeKotaAsal,
       kode_kota_tujuan: values.kodeKotaTujuan,
       kode_satuan: values.kodeSatuan,
       biaya_satuan: values.biayaSatuan,
       pajak_persen: values.pajakPersen,
       jumlah_pajak: values.jumlahPajak,
       jumlah: values.jumlah,
       total: values.total,
     });
   });

   petugas.forEach((values) => {
     payloadPetugas.push({
       kode_trx: data.kodeTrx,
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

   db.transaction()
     .then(async (t) => {
       return await SuratTugasPerjadin.update(
         payloadHeader,
         {
           where: {
             id_surat_tugas: data.idSuratTugas,
           },
         },
         {
           transaction: t,
         }
       )
         .then(async (result) => {
           if (!result) {
             jsonFormat(res, "failed", "Failed to record data!");
             logger.debug(`database SuratTugasPerjadin failed : ${result}`);
           }
           await KomponenPerjadin.update(
             payloadPerjalanan,

             {
               where: {
                 id_surat_tugas: KomponenPerjadin.kodeTrx,
               },
             },
             {
               transaction: t,
             }
           )
             .then(async (result) => {
               if (!result) {
                 jsonFormat(res, "failed", "Failed to record data!");
                 logger.debug(`database KomponenPerjadin failed : ${result}`);
               }
               await PetugasPerjadin.update(
                 payloadPetugas,
                 {
                   where: {
                     id_surat_tugas: payloadPetugas.kodeTrx,
                   },
                 },
                 {
                   transaction: t,
                 }
               )
                 .then((response) => {
                   if (!result) {
                     jsonFormat(res, "failed", "Failed to record data!");
                     logger.debug(
                       `database KomponenPerjadin failed : ${result}`
                     );
                   }
                   jsonFormat(
                     res,
                     "success",
                     "Successfully",
                     "Data successfully recorded",
                     response
                   );
                   t.commit();
                 })
                 .catch((err) => {
                   t.rollback();
                   logger.debug(`database PetugasPerjadin catch : ${err}`);
                   logger.error(`database PetugasPerjadin catch : ${err}`);
                 });
             })
             .catch((err) => {
               t.rollback();
               logger.debug(`database KomponenPerjadin catch : ${err}`);
               logger.error(`database KomponenPerjadin catch : ${err}`);
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

module.exports = perjadinUpdate;
