const debug = require("log4js");
const logger = debug.getLogger();
const db = require("../../../config/database");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const { jsonFormat } = require("../../../utils/jsonFormat");

const perjadinAssignments = (req, res, next) => {
    const data = req.body;
    const perjalanan = data.komponenPerjalanan;
    const petugas = data.komponenPetugas;
    const payloadPerjalanan = []
    const payloadPetugas = []

    const payloadHeader = {
        "tahun": data.tahun,
        "id_surat_tugas": data.idSuratTugas,
        "nomor_surat_tugas": data.nomorSuratTugas,
        "tanggal_surat_tugas": data.tanggalSuratTugas,
        "jenis_kegiatan": data.jenisKegiatan,
        "jenis_perjalanan": data.jenisPerjalanan,
        "keterangan_perjadin": data.keteranganPerjadin,
        "jumlah_orang": data.jumlahOrang,
        "data_pengusulan": "TRANSAKSI-BARU",
        "kode_status": 0,
        "path_dokumen": data.pathDokumen,
        "ucr": data.ucr
    }

    perjalanan.forEach(values => {
        payloadPerjalanan.push({
            "kode_surat_tugas": values.kodeSuratTugas,
            "id_petugas": values.idPetugas,
            "urutTugas": values.urutTugas,
            "nip": values.nip,
            "kode_komponen_honor": values.kodeKomponenHonor,
            "keterangan_komponen": values.keteranganKomponen,
            "tahun": values.tahun,
            "kode_kota_asal": values.kodeKotaAsal,
            "kode_kota_tujuan": values.kodeKotaTujuan,
            "kode_satuan": values.kodeSatuan,
            "biaya_satuan": values.biayaSatuan,
            "pajak_persen": values.pajakPersen,
            "jumlah_pajak": values.jumlahPajak,
            "jumlah": values.jumlah,
            "total": values.total
            })
    });

    petugas.forEach(values => {
        payloadPetugas.push( {
            "kode_surat_tugas": values.kodeSuratTugas,
            "nip": values.nip,
            "kode_tempat_asal": values.kodeTempatAsal,
            "kode_kota_tujuan": values.kodeKotaTujuan,
            "tahun": values.tahun,
            "kode_kota_asal": values.kodeBankAsal,
            "urut_tugas": values.urutTugas,
            "nama_petugas": values.namaPetugas,
            "nama_bank": values.namaBank,
            "kode_bank_asal": values.kodeBankAsal,
            "nomor_rekening": values.nomorRekening,
            "kode_bank_tujuan": values.kodeBankTujuan,
            "nomor_rekening_dipakai": values.nomorRekeningDipakai,
            "gol": values.gol,
            "eselon": values.eselon,
            "npwp": values.npwp,
            "kode_provinsi_asal": values.kodeProvinsiAsal,
            "kode_provinsi_tujuan": values.kodeProvinsiTujuan,
            "nama_kota_asal": values.namaKotaAsal,
            "nama_kota_tujuan": values.namaKotaTujuan,
            "kode_unit_tujuan": values.kodeUnitTujuan,
            "tanggal_pergi": values.tanggalPergi,
            "tanggal_pulang": values.tanggalPulang,
            "lama_perjalanan": values.lamaPerjalanan
        })
    })

    db.transaction().then(async (t) => {
          return await SuratTugasPerjadin.create(payloadHeader, {transaction: t}).then(async (result) => {
              if (!result) {
                jsonFormat(res, "failed", "Failed to record data!");
                logger.debug(`database SuratTugasPerjadin failed : ${result}`);
              }
                await KomponenPerjadin.bulkCreate(payloadPerjalanan,{transaction: t}).then(async (result) => {
                    if (!result) {
                        jsonFormat(res, "failed", "Failed to record data!");
                        logger.debug(`database KomponenPerjadin failed : ${result}`);
                    }
                    await PetugasPerjadin.bulkCreate(payloadPetugas, {transaction: t}).then((response) => {
                        if (!result) {
                            jsonFormat(res, "failed", "Failed to record data!");
                            logger.debug(`database KomponenPerjadin failed : ${result}`);
                        } 
                        jsonFormat(res, "success", "Successfully", 'Data successfully recorded', response);
                        t.commit();
                    }).catch((err) => {
                        t.rollback();
                        logger.debug(`database PetugasPerjadin catch : ${err}`);
                        logger.error(`database PetugasPerjadin catch : ${err}`);
                    })
              }).catch((err) => {
                t.rollback();
                logger.debug(`database KomponenPerjadin catch : ${err}`);
                logger.error(`database KomponenPerjadin catch : ${err}`);
              })
              
          }).catch((err) => {
              logger.debug(`database SuratTugasPerjadin catch : ${err}`);
              logger.error(`database SuratTugasPerjadin catch : ${err}`);
              jsonFormat(res, "failed", {responseCode: err.parent.errno, responseMessage: err.parent.sqlMessage});
              t.rollback();
          });
    }).catch((err) => {
        logger.debug(`database perjadinAssignments catch : ${err}`);
        logger.error(`database perjadinAssignments catch : ${err}`);
        next(err);
    });
}

module.exports = perjadinAssignments;

// API diri ku tidak digunakan udah cape mikir gak di pake cape deh!!!!