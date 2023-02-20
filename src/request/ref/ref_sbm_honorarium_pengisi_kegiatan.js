const { check } = require("express-validator");

exports.show = [
    check("tugas").exists().withMessage("params tugas harus ada."),
    check("jabatan").exists().withMessage("params jabatan harus ada."),
    check("eselon").exists().withMessage("params eselon harus ada."),
  ];

exports.store = [
    check("tugas").notEmpty().withMessage("tugas harus ada."),
    check("jabatan").notEmpty().withMessage("jabatan harus ada."),
    check("eselon").notEmpty().withMessage("eselon harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("tugas").exists().withMessage("params tugas harus ada."),
    check("jabatan").exists().withMessage("params jabatan harus ada."),
    check("eselon").exists().withMessage("params eselon harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  