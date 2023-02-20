const { check } = require("express-validator");

exports.create = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("satuan").notEmpty().withMessage("satuan harus di isi."),
  check("eselonI").notEmpty().withMessage("eselonI harus di isi."),
  check("eselonII").notEmpty().withMessage("eselonII harus di isi."),
  check("eselonIII").notEmpty().withMessage("eselonIII harus di isi."),
  check("eselonIV").notEmpty().withMessage("eselonIV harus di isi."),
  check("non_eselon").notEmpty().withMessage("non_eselon harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
    check("satuan").notEmpty().withMessage("satuan harus di isi."),
    check("eselonI").notEmpty().withMessage("eselonI harus di isi."),
    check("eselonII").notEmpty().withMessage("eselonII harus di isi."),
    check("eselonIII").notEmpty().withMessage("eselonIII harus di isi."),
    check("eselonIV").notEmpty().withMessage("eselonIV harus di isi."),
    check("non_eselon").notEmpty().withMessage("non_eselon harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
];