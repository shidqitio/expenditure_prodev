const { check } = require("express-validator");

exports.multirenderkirimpanutan = [
  check("dokumen")
    .notEmpty().isArray()
    .withMessage("dokumen Harus diisi dan berbentuk array"),
  check("dokumen.*.scriptHtml")
    .notEmpty()
    .withMessage("dokumen.*.scriptHtml Harus diisi"),
  check("dokumen.*.sifat_surat")
    .notEmpty()
    .withMessage("dokumen.*.sifat_surat Harus diisi"),
  check("dokumen.*.id_trx")
    .notEmpty()
    .withMessage("dokumen.*.id_trx Harus diisi"),
  check("dokumen.*.nomor_surat")
    .notEmpty()
    .withMessage("dokumen.*.nomor_surat Harus diisi"),
  check("dokumen.*.perihal")
    .notEmpty()
    .withMessage("dokumen.*.perihal Harus diisi"),
  check("dokumen.*.tanggal_surat")
    .notEmpty()
    .withMessage("dokumen.*.tanggal_surat Harus diisi"),

  check("dokumen.*.nip_pembuat")
    .notEmpty()
    .withMessage("dokumen.*.nip_pembuat Harus diisi"),
  check("dokumen.*.nip_penandatangan")
    .notEmpty()
    .isArray()
    .withMessage("dokumen.*.nip_penandatangan Harus diisi dengan array"),
  check("dokumen.*.tahun")
    .notEmpty()
    .withMessage("dokumen.*.tahun Harus diisi"),
];

exports.renderkirimpanutan = [
  check("scriptHtml")
    .notEmpty()
    .withMessage("scriptHtml Harus diisi"),
  check("sifat_surat")
    .notEmpty()
    .withMessage("sifat_surat Harus diisi"),
  check("id_trx")
    .notEmpty()
    .withMessage("id_trx Harus diisi"),
  check("nomor_surat")
    .notEmpty()
    .withMessage("nomor_surat Harus diisi"),
  check("perihal")
    .notEmpty()
    .withMessage("perihal Harus diisi"),
  check("tanggal_surat")
    .notEmpty()
    .withMessage("tanggal_surat Harus diisi"),

  check("nip_pembuat")
    .notEmpty()
    .withMessage("nip_pembuat Harus diisi"),
  check("nip_penandatangan")
    .notEmpty()
    .isArray()
    .withMessage("nip_penandatangan Harus diisi dengan array"),
  check("tahun")
    .notEmpty()
    .withMessage("tahun Harus diisi"),
];


exports.getnomor = [
  check("kode_surat").notEmpty().withMessage("kode_surat Harus diisi"),
  check("kode_unit").notEmpty().withMessage("kode_unit diisi"),
  check("type_surat").notEmpty().withMessage("type_surat diisi"),
  check("sifat_surat").notEmpty().withMessage("sifat_surat diisi"),
  check("id_jenis_surat").notEmpty().withMessage("id_jenis_surat diisi"),
  check("id_jenis_nd").notEmpty().withMessage("id_jenis_nd diisi"),
  check("id_klasifikasi").notEmpty().withMessage("id_klasifikasi Harus diisi"),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit Harus diisi"),
  check("id_user").notEmpty().withMessage("id_user Harus diisi"),
  check("ucr").notEmpty().withMessage("ucr Harus diisi"),
  check("tanggal").notEmpty().withMessage("tanggal Harus diisi"),
];

exports.getnomormulti = [
  check("dataNomor")
    .notEmpty()
    .isArray()
    .withMessage("dataNomor Harus diisi array"),
  check("dataNomor.*.kode_surat")
    .notEmpty()
    .withMessage("dataNomor.*.kode_surat Harus diisi"),
  check("dataNomor.*.kode_unit")
    .notEmpty()
    .withMessage("dataNomor.*.kode_unit diisi"),
  check("dataNomor.*.type_surat")
    .notEmpty()
    .withMessage("dataNomor.*.type_surat diisi"),
  check("dataNomor.*.sifat_surat")
    .notEmpty()
    .withMessage("dataNomor.*.sifat_surat diisi"),
  check("dataNomor.*.id_jenis_surat")
    .notEmpty()
    .withMessage("dataNomor.*.id_jenis_surat diisi"),
  check("dataNomor.*.id_jenis_nd")
    .notEmpty()
    .withMessage("dataNomor.*.id_jenis_nd diisi"),
  check("dataNomor.*.id_klasifikasi")
    .notEmpty()
    .withMessage("dataNomor.*.id_klasifikasi Harus diisi"),
  check("dataNomor.*.id_sub_unit")
    .notEmpty()
    .withMessage("dataNomor.*.id_sub_unit Harus diisi"),
  check("dataNomor.*.id_user")
    .notEmpty()
    .withMessage("dataNomor.*.id_user Harus diisi"),
  check("dataNomor.*.ucr")
    .notEmpty()
    .withMessage("dataNomor.*.ucr Harus diisi"),
  check("dataNomor.*.dataNomor.*.tanggal")
    .notEmpty()
    .withMessage("tanggal Harus diisi"),
];

// req.body.kode_surat,
//       req.body.katagori_surat,
//       req.body.kode_unit,
//       req.body.tahun,
//       req.body.type_surat,
//       req.body.sifat_surat,
//       req.body.id_jenis_surat,
//       req.body.id_jenis_nd,
//       req.body.id_jenis_nd,
//       req.body.id_klasifikasi,
//       req.body.id_sub_unit,
//       req.body.id_user,
//       req.body.ucr,
//       req.body.tanggal,