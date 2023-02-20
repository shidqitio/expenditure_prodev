const { check } = require("express-validator");

exports.create = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("nama_kabko").notEmpty().withMessage("nama kabko harus di isi."),
  check("pusat_kabko").notEmpty().withMessage("pusat kabko harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createpanutan = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("nama_kabko").notEmpty().withMessage("nama kabko harus di isi."),
  check("pusat_kabko").notEmpty().withMessage("pusat kabko harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("nama_kabko").notEmpty().withMessage("nama kabko harus di isi."),
  check("pusat_kabko").notEmpty().withMessage("pusat kabko harus di isi."),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];

exports.penguranganrka = [
  check("kode_RKA").notEmpty().withMessage("kode RKA harus di isi."),
  check("kode_periode").notEmpty().withMessage("kode periode harus di isi."),
  check("id_surat_tugas").notEmpty().withMessage("id surat tugas harus di isi."),
  check("kode_aktivitas_rkatu").notEmpty().withMessage("kode_aktivitas_rkatu  harus di isi."),
  check("jumlah_budget").notEmpty().withMessage("jumlah_budget harus di ada."),
  check("kode_kegiatan_ut_detail").notEmpty().withMessage("kode_kegiatan_ut_detail harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("tanggal_surat_tugas").notEmpty().withMessage("tanggal_surat_tugas harus di isi."),
  check("nip_unit_pemaraf").notEmpty().withMessage("nip_unit_pemaraf harus di isi."),
  check("ucr").notEmpty().withMessage("User rio harus di ada.")

];
