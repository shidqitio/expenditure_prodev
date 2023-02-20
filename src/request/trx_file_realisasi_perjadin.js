const { check } = require("express-validator");

exports.create = [
  check("keterangan").notEmpty().withMessage("keteranag harus di isi."),
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi."),
  check("kode_kota_tujuan").notEmpty().withMessage("kode_kota_tujuan harus di isi."),
  check("tahun").notEmpty().withMessage("tahun  harus di isi."),
  check("kode_komponen_honor").notEmpty().withMessage("kode komponen honor  harus di isi."),
  check("biaya").notEmpty().withMessage("biaya tidak boleh kosong")
];

exports.remove = [
  check("id_trx").notEmpty().withMessage("id_trx harus di isi."),
  check("link_file").notEmpty().withMessage("link_file harus di isi.")
];