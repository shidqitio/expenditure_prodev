


const { check } = require("express-validator");

exports.insertPetugasTHL = [
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi."),
  check("nomor_surat").notEmpty().withMessage("nomor_surat harus di isi."),
  check("tanggal_surat").notEmpty().withMessage("tanggal_surat harus di isi."),
  check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),
  check("perihal").notEmpty().withMessage("perihal harus di isi."),
  check("penandatangan").notEmpty().withMessage("penandatangan harus di isi."),
  check("jenis_honor").notEmpty().withMessage("jenis_honor harus di isi."),
  check("kode_status").notEmpty().withMessage("kode_status harus di isi."),
  check("jenis_honor").notEmpty().withMessage("jenis_honor harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
  check("DataPetugas")
    .notEmpty()
    .isArray()
    .withMessage("DataPetugas harus di isi dan berbentuk array."),
  check("DataPetugas.*.nip")
    .notEmpty()
    .withMessage("DataPetugas.*.nip harus di isi."),
  check("DataPetugas.*.katagori")
    .notEmpty()
    .withMessage("DataPetugas.*.katagori harus di isi."),
  check("DataPetugas.*.tugas")
    .notEmpty()
    .withMessage("DataPetugas.*.tugas harus di isi."),
  check("DataPetugas.*.email")
    .notEmpty()
    .withMessage("DataPetugas.*.email harus di isi."),
  check("DataPetugas.*.npwp")
    .notEmpty()
    .withMessage("DataPetugas.*.npwp harus di isi."),
  check("DataPetugas.*.volume_1")
    .notEmpty()
    .withMessage("DataPetugas.*.volume_1 harus di isi."),
  check("DataPetugas.*.kode_bank")
    .notEmpty()
    .withMessage("DataPetugas.*.kode_bank harus di isi."),
  check("DataPetugas.*.nama_bank")
    .notEmpty()
    .withMessage("DataPetugas.*.nama_bank harus di isi."),
  check("DataPetugas.*.no_rekening")
    .notEmpty()
    .withMessage("DataPetugas.*.no_rekening harus di isi."),
  check("DataPetugas.*.atas_nama_rekening")
    .notEmpty()
    .withMessage("DataPetugas.*.atas_nama_rekening harus di isi."),
];

exports.updateSuratPanutan = [
  check("id_surat").notEmpty().withMessage("id_surat harus di isi."),
];