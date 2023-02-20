const { check } = require("express-validator");
exports.show = [
    check("jenjang_ngajar").exists().withMessage("params jenjang_ngajar harus ada.")
  ];

exports.store = [
    check("jenjang_ngajar").notEmpty().withMessage("jenjang_ngajar harus di isi."),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("jenjang_ngajar").exists().withMessage("params jenjang_ngajar harus ada."),
    check("besaran").notEmpty().isInt().withMessage("besaran harus di isi dengan angka"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  