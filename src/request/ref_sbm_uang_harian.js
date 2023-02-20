const { check } = require("express-validator");

exports.create = [
  check("kode_provinsi").notEmpty().withMessage("kode provinsi harus di isi."),
  check("satuan").notEmpty().withMessage("satuan harus di isi."),
  check("luarkota").notEmpty().withMessage("luarkota harus di isi."),
  check("dalamkota").notEmpty().withMessage("dalamkota harus di isi."),
  check("diklat").notEmpty().withMessage("diklat harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.update = [
    check("satuan").notEmpty().withMessage("satuan harus di isi."),
    check("luarkota").notEmpty().withMessage("luarkota harus di isi."),
    check("dalamkota").notEmpty().withMessage("dalamkota harus di isi."),
    check("diklat").notEmpty().withMessage("diklat harus di isi."),
    check("uch").notEmpty().withMessage("User update harus di ada."),
];