const { check } = require("express-validator");
exports.create = [
  check("kode_nomor_surat")
    .notEmpty()
    .withMessage("kode_nomor_surat harus di isi."),

  check("tahun").notEmpty().withMessage("tahun harus di isi."),

  check("kode_rka").notEmpty().withMessage("kode_rka harus di isi."),

  check("kode_periode").notEmpty().withMessage("kode_periode harus di isi."),

  check("perihal").notEmpty().withMessage("perihal harus di isi."),

  check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),

  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi."),

  check("id_user").notEmpty().withMessage("id_user harus di isi."),

  check("tanggal").notEmpty().withMessage("tanggal harus di isi."),

  check("tanggal_surat").notEmpty().withMessage("tanggal_surat harus di isi."),

  check("penerima_orang_pertama")
    .notEmpty()
    .withMessage("penerima_orang_pertama harus di isi."),

  check("kode_bank").notEmpty().withMessage("kode_bank harus di isi."),

  check("no_rekening").notEmpty().withMessage("no_rekening harus di isi."),

  check("jumlah_penerima")
    .notEmpty()
    .withMessage("jumlah_penerima harus di isi."),

  check("biaya_spp").notEmpty().withMessage("biaya_spp harus di isi."),

  check("katagori").notEmpty().withMessage("katagori harus di isi."),

  check("pph").notEmpty().withMessage("pph harus di isi."),

  check("ppn").notEmpty().withMessage("ppn harus di isi."),

  check("kode_status").notEmpty().withMessage("kode_status harus di isi."),

  check("ucr").notEmpty().withMessage("ucr harus di isi."),
];

exports.updatestatus = [
  check("kode_status").notEmpty().withMessage("kode_status harus di isi."),
  check("uch").notEmpty().withMessage("uch harus di isi."),
];

exports.updaterka = [
  check("kode_rka").notEmpty().withMessage("kode_rka harus di isi."),
  check("kode_periode").notEmpty().withMessage("kode_periode harus di isi."),
  check("uch").notEmpty().withMessage("uch harus di isi."),
];

exports.updatestatus = [
  check("kode_status").notEmpty().withMessage("kode_status harus di isi."),
  check("uch").notEmpty().withMessage("uch harus di isi."),
];


exports.update = [
  check("perihal").notEmpty().withMessage("perihal harus di isi."),

  check("penerima_orang_pertama")
    .notEmpty()
    .withMessage("penerima_orang_pertama harus di isi."),

  check("kode_bank").notEmpty().withMessage("kode_bank harus di isi."),

  check("no_rekening").notEmpty().withMessage("no_rekening harus di isi."),

  check("jumlah_penerima")
    .notEmpty()
    .withMessage("jumlah_penerima harus di isi."),

  check("biaya_spp").notEmpty().withMessage("biaya_spp harus di isi."),

  check("pph").notEmpty().withMessage("pph harus di isi."),

  check("ppn").notEmpty().withMessage("ppn harus di isi."),
];