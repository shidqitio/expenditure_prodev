const { check } = require("express-validator");

exports.createkabkopanutan = [
    check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
    check("nama_kabko").notEmpty().withMessage("nama kabko harus di isi."),
    check("pusat_kabko").notEmpty().withMessage("pusat kabko harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
  ];

  exports.createpokjarpanutan = [
    check("kode_kabko").notEmpty().withMessage("kode kabko harus di isi."),
    check("nama_pokjar").notEmpty().withMessage("nama pokjar harus di isi"),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
  ];

  exports.createprovinsipanutan = [
    check("kode_negara").notEmpty().withMessage("kode negara harus di isi."),
    check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
    check("nama_provinsi").notEmpty().withMessage("nama provinsi harus di isi."),
    check("ibukota_provinsi").notEmpty().withMessage("ibu kota provinsi harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
  ];

  exports.createsbmpanutan = [
    check("kode_unit").notEmpty().withMessage("kode unit harus di isi."),
    check("kode_provinsi_asal").notEmpty().withMessage("kode provinsi asal harus di isi."),
    check("asal").notEmpty().withMessage("asal harus di isi."),
    check("tujuan").notEmpty().withMessage("tujuan harus di isi."),
    check("kode_provinsi_tujuan").notEmpty().withMessage("kode provinsi tujuan harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
  ];