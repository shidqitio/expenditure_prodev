const { check } = require("express-validator");

exports.create = [
  check("kode_unit").notEmpty().withMessage("kode unit harus di isi."),
  check("kode_provinsi_asal").notEmpty().withMessage("kode provinsi asal harus di isi."),
  check("asal").notEmpty().withMessage("asal harus di isi."),
  check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
  check("kode_provinsi_tujuan").notEmpty().withMessage("kode provinsi tujuan harus di isi."),
  check("udara").notEmpty().withMessage("biaya udara harus di isi."),
  check("darat").notEmpty().withMessage("biaya darat harus di isi."),
  check("laut").notEmpty().withMessage("biaya laut harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.create_multi = [
  check("kode_provinsi_asal")
    .notEmpty()
    .withMessage("kode provinsi asal harus di isi."),
  check("asal").notEmpty().withMessage("asal harus di isi."),
  check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
  check("kode_provinsi_tujuan")
    .notEmpty()
    .withMessage("kode provinsi tujuan harus di isi."),
  check("udara").notEmpty().withMessage("biaya udara harus di isi."),
  check("darat").notEmpty().withMessage("biaya darat harus di isi."),
  check("laut").notEmpty().withMessage("biaya laut harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createUnit = [
  check("kode_unit").notEmpty().withMessage("kode unit harus di isi."),
  check("kode_provinsi_asal")
    .notEmpty()
    .withMessage("kode provinsi asal harus di isi."),
  check("asal").notEmpty().withMessage("asal harus di isi."),
  check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
  check("kode_provinsi_tujuan")
    .notEmpty()
    .withMessage("kode provinsi tujuan harus di isi."),
  check("udara").notEmpty().withMessage("biaya udara harus di isi."),
  check("darat").notEmpty().withMessage("biaya darat harus di isi."),
  check("laut").notEmpty().withMessage("biaya laut harus di isi."),
  check("keterangan").notEmpty().withMessage("keterangan harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createpanutan = [
  check("kode_unit").notEmpty().withMessage("kode unit harus di isi."),
  check("kode_provinsi_asal").notEmpty().withMessage("kode provinsi asal harus di isi."),
  check("asal").notEmpty().withMessage("asal harus di isi."),
  check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
  check("kode_provinsi_tujuan").notEmpty().withMessage("kode provinsi tujuan harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
//   check("kode_unit").notEmpty().withMessage("kode unit harus di isi."),
//   check("kode_provinsi_asal").notEmpty().withMessage("kode provinsi asal harus di isi."),
//   check("asal").notEmpty().withMessage("asal harus di isi."),
//   check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
//   check("kode_provinsi_tujuan").notEmpty().withMessage("kode provinsi tujuan harus di isi."),
  check("udara").notEmpty().withMessage("biaya udara harus di isi."),
  check("darat").notEmpty().withMessage("biaya darat harus di isi."),
  check("laut").notEmpty().withMessage("biaya laut harus di isi."),
  check("uch").notEmpty().withMessage("User update harus di ada."),
];
