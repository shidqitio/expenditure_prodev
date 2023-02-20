const { check } = require("express-validator");

exports.show = [
    check("kegiatan").exists().withMessage("params kegiatan harus ada."),
    check("jenis_konsumsi").exists().withMessage("params jenis_konsumsi harus ada."),
  ];

exports.store = [
    check("kegiatan").notEmpty().withMessage("params kegiatan harus ada."),
    check("jenis_konsumsi").notEmpty().withMessage("params jenis_konsumsi harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("kegiatan").exists().withMessage("params kegiatan harus ada."),
    check("jenis_konsumsi").exists().withMessage("params jenis_konsumsi harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  