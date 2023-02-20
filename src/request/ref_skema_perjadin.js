const { check } = require("express-validator");

exports.pilihskema = [
  check("id_surat").notEmpty().withMessage("id surat harus di isi."),
  check("kode_skema").notEmpty().withMessage("kode skema harus di isi"),
];

exports.pilihskemanew = [
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi"),
  check("kode_skema_perjadin").notEmpty().withMessage("kode_skema_perjadin harus di isi"),
];

exports.transport = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi"),
  check("kode_kota_asal").notEmpty().withMessage("kode_kota_asal harus di isi"),
  check("kode_kota_tujuan").notEmpty().withMessage("kode_kota_tujuan harus di isi"),
  check("transport").notEmpty().withMessage("transport harus di isi"),
  check("id_provinsi_asal").notEmpty().withMessage("id_provinsi_asal harus di isi"),
  check("id_provinsi_tujuan").notEmpty().withMessage("id_provinsi_tujuan harus di isi"),
  check("kode_satuan").notEmpty().withMessage("kode_satuan harus di isi"),
];

exports.updateSkemaPerorang = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi"),
  check("kode_kota_asal").notEmpty().withMessage("kode_kota_asal harus di isi"),
  check("kode_kota_tujuan").notEmpty().withMessage("kode_kota_tujuan harus di isi"),
  check("kode_provinsi_tujuan").notEmpty().withMessage("kode_provinsi_tujuan harus di isi"),
  check("skemaPerjalanan").notEmpty().withMessage("skemaPerjalanan harus di isi"),
  check("skemaPerjalanan").isArray().withMessage("skemaPerjalanan harus bentuk Array"),
  check("skemaPerjalanan.*.kode_skema").notEmpty().withMessage("skemaPerjalanan.*.kode_skema harus di isi"),
  check("skemaPerjalanan.*.jumlah_hari").notEmpty().withMessage("skemaPerjalanan.*.jumlah_hari harus di isi"),
];

// "id_surat_tugas":909,
//   "nip":"199504212017TKT0713",
//   "kode_kota_asal":"ID.36.05.33",
//   "kode_kota_tujuan":"ID.33.02.02",
//   "kode_transport":"udara",
//   "transport":"darat",
//   "id_provinsi_asal":"ID.36",
//   "id_provinsi_tujuan":"ID.33",
//   "kode_satuan":"PP",
//   "kode_unit":"UN31.UPBJ",
//   "tahun":2022

exports.transportnew = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("nip").notEmpty().withMessage("nip harus di isi"),
  check("kode_kota_asal").notEmpty().withMessage("kode_kota_asal harus di isi"),
  check("kode_kota_tujuan").notEmpty().withMessage("kode_kota_tujuan harus di isi"),
  check("kode_transport").notEmpty().withMessage("kode_transport harus di isi"),
  check("id_provinsi_asal").notEmpty().withMessage("id_provinsi_asal harus di isi"),
  check("id_provinsi_tujuan").notEmpty().withMessage("id_provinsi_tujuan harus di isi"),
  check("kode_satuan").notEmpty().withMessage("kode_satuan harus di isi"),
  check("kode_unit").notEmpty().withMessage("kode_unit harus di isi"),
  check("tahun").notEmpty().withMessage("tahun harus di isi"),
];