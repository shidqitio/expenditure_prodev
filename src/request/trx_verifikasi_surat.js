const { check } = require("express-validator");

exports.verifikasiunit = [
  check("katagori").notEmpty().withMessage("katagori harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi."),
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("nip_keuangan").notEmpty().withMessage("nip_keuangan harus di isi.")
];

exports.verifikasikeuangan = [
  check("katagori").notEmpty().withMessage("katagori harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi."),
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
];

exports.update = [
    check("nama_negara").notEmpty().withMessage("nama negara harus di isi."),
    check("ibukota_negara").notEmpty().withMessage("ibu kota negara harus di isi."),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];
