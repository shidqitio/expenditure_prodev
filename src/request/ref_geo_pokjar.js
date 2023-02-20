const { check } = require("express-validator");

exports.create = [
  check("kode_kabko").notEmpty().withMessage("kode kabko harus di isi."),
  check("nama_pokjar").notEmpty().withMessage("nama pokjar harus di isi"),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createpanutan = [
  check("kode_kabko").notEmpty().withMessage("kode kabko harus di isi."),
  check("nama_pokjar").notEmpty().withMessage("nama pokjar harus di isi"),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
  check("kode_kabko").notEmpty().withMessage("kode kabko harus di isi."),
  check("nama_pokjar").notEmpty().withMessage("nama pokjar harus di isi"),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];
