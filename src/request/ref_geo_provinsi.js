const { check } = require("express-validator");

exports.create = [
  check("kode_negara").notEmpty().withMessage("kode negara harus di isi."),
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("nama_provinsi").notEmpty().withMessage("nama provinsi harus di isi."),
  check("ibukota_provinsi").notEmpty().withMessage("ibu kota provinsi harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createpanutan = [
  check("kode_negara").notEmpty().withMessage("kode negara harus di isi."),
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("nama_provinsi").notEmpty().withMessage("nama provinsi harus di isi."),
  check("ibukota_provinsi").notEmpty().withMessage("ibu kota provinsi harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
    check("kode_negara").notEmpty().withMessage("kode negara harus di isi."),
    check("nama_provinsi").notEmpty().withMessage("nama provinsi harus di isi."),
    check("ibukota_provinsi").notEmpty().withMessage("ibu kota provinsi harus di isi."),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];
