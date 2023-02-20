const { check } = require("express-validator");

exports.show = [
    check("bentuk_kegiatan").exists().withMessage("params bentuk_kegiatan harus ada."),
    check("sub_kegiatan").exists().withMessage("params sub_kegiatan harus ada."),
    check("komponen").exists().withMessage("params komponen harus ada."),
    check("kategori").exists().withMessage("params kategori harus ada."),
  ];

exports.store = [
    check("bentuk_kegiatan").notEmpty().withMessage("bentuk_kegiatan harus ada."),
    check("sub_kegiatan").notEmpty().withMessage("sub_kegiatan harus ada."),
    check("komponen").notEmpty().withMessage("komponen harus ada."),
    check("kategori").notEmpty().withMessage("kategori harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("keterangan").notEmpty().withMessage("keterangan harus di isi"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("bentuk_kegiatan").exists().withMessage("params bentuk_kegiatan harus ada."),
    check("sub_kegiatan").exists().withMessage("params sub_kegiatan harus ada."),
    check("komponen").exists().withMessage("params komponen harus ada."),
    check("kategori").exists().withMessage("params kategori harus ada."),
    check("satuan").notEmpty().withMessage("satuan harus di isi "),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("keterangan").notEmpty().withMessage("keterangan harus di isi"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  