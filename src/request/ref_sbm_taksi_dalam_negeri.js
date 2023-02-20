const { check } = require("express-validator");

exports.create = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("satuan").notEmpty().withMessage("satuan harus di isi."),
  check("kode_katagori_sbm").notEmpty().withMessage("eselonI harus di isi."),
  check("nomor_sk_sbm").notEmpty().withMessage("eselonII harus di isi."),
  check("biaya").notEmpty().withMessage("eselonIII harus di isi."),
  
];

exports.update = [
    check("satuan").notEmpty().withMessage("satuan harus di isi."),
    check("kode_katagori_sbm").notEmpty().withMessage("eselonI harus di isi."),
    check("nomor_sk_sbm").notEmpty().withMessage("eselonII harus di isi."),
    check("biaya").notEmpty().withMessage("eselonIII harus di isi."),
];