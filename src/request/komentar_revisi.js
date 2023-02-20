const { check } = require("express-validator");

exports.store = [
  check("kode_ruang").notEmpty().withMessage("kode_ruang harus di isi."),
  check("komentar").notEmpty().withMessage("komentar harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
];