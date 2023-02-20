const { check } = require("express-validator");
exports.show = [
    check("golongan").exists().withMessage("params golongan harus ada."),
    check("jenis_pegawai").exists().withMessage("params jenis_pegawai harus ada."),
    check("teknisi").exists().isIn(['-','TEKNISI','NON-TEKNISI']).withMessage("paramsteknisi harus di isi dengan ( - | TEKNISI | NON-TEKNISI )")
  ];

exports.store = [
    check("golongan").notEmpty().withMessage(" golongan harus ada."),
    check("jenis_pegawai").notEmpty().withMessage(" jenis_pegawai harus ada."),
    check("teknisi").notEmpty().isIn(['-','TEKNISI','NON-TEKNISI']).withMessage("teknisi harus di isi dengan ( - | TEKNISI | NON-TEKNISI )"),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("golongan").exists().withMessage("params golongan harus ada."),
    check("jenis_pegawai").exists().withMessage("params jenis_pegawai harus ada."),
    check("teknisi").exists().isIn(['-','TEKNISI','NON-TEKNISI']).withMessage("paramsteknisi harus di isi dengan ( - | TEKNISI | NON-TEKNISI )"),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  