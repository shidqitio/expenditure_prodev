const { check } = require("express-validator");
exports.show = [
    check("golongan").exists().withMessage("params golongan harus ada."),
    check("status_npwp").exists().isIn(['WITH-NPWP','WITHOUT-NPWP']).withMessage("params status_npwp harus di isi dengan ('WITH-NPWP','WITHOUT-NPWP')")
  ];

exports.store = [
    check("golongan").notEmpty().withMessage("golongan harus di isi."),
    check("status_npwp").notEmpty().isIn(['WITH-NPWP','WITHOUT-NPWP']).withMessage("status_npwp harus di isi dengan ('WITH-NPWP','WITHOUT-NPWP')"),
    check("besaran_pajak").notEmpty().isInt().withMessage("besaran_pajak harus di isi dengan angka"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.edit = [
    check("golongan").exists().withMessage("params golongan harus ada."),
    check("status_npwp").exists().isIn(['WITH-NPWP','WITHOUT-NPWP']).withMessage("params status_npwp harus di isi dengan ('WITH-NPWP','WITHOUT-NPWP')"),
    check("besaran_pajak").notEmpty().isInt().withMessage("besaran_pajak harus di isi dengan angka"),
    check("uch").notEmpty().withMessage("uch harus di isi."),
  ];
  