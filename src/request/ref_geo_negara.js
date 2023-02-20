const { check } = require("express-validator");

exports.create = [
  check("kode_negara").notEmpty().withMessage("kode negara harus di isi."),
  check("nama_negara").notEmpty().withMessage("nama negara harus di isi."),
  check("ibukota_negara").notEmpty().withMessage("ibu kota negara harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
    check("nama_negara").notEmpty().withMessage("nama negara harus di isi."),
    check("ibukota_negara").notEmpty().withMessage("ibu kota negara harus di isi."),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];
