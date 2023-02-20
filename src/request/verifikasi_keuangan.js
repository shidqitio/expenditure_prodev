const { check } = require("express-validator");

exports.getnomor = [
  check("surat").notEmpty().withMessage("surat harus di isi."),
  check("surat").isArray().withMessage("surat harus berbentuk array."),
  check("id_surat_tugas").notEmpty().withMessage(" id_surat_tugas coba harus di isi."),
  check("id_sub_unit").notEmpty().withMessage(" id_sub_unit coba harus di isi."),
  check("id_user").notEmpty().withMessage(" id_user coba harus di isi."),
  check("tahun").notEmpty().withMessage(" tahun coba harus di isi."),
  check("tanggal").notEmpty().withMessage(" tanggal coba harus di isi."),
  check("kode_unit").notEmpty().withMessage(" harus coba harus di isi."),
  check("surat.*.sifat_surat").notEmpty().withMessage("sifat surat  harus di isi."),
  check("surat.*.katagori_surat").notEmpty().withMessage("katagori surat harus di isi."),
  check("surat.*.id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus di isi."),
  check("surat.*.id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus di isi."),
  check("surat.*.perihal").notEmpty().withMessage("perihal surat harus di isi."),
  check("surat.*.id_klasifikasi").notEmpty().withMessage("id_klasifikasi surat harus di isi."),
  check("surat.*.type_surat").notEmpty().withMessage("type_surat surat harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus coba pokonya harus ada di ada."),
];

exports.renderdankirim = [
  check("tahun").notEmpty().withMessage("Tahun harus diisi"),
  check("dokumen").notEmpty().withMessage("dokumen Harus diisi"),
  check("dokumen.*.scriptHtml").notEmpty().withMessage("Script Html Harus diisi"),
  check("dokumen.*.id_jenis_surat").notEmpty().withMessage("id_jenis_surat Harus diisi"),
  check("dokumen.*.jenis_surat").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.id_jenis_nd").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.perihal").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.id_klasifikasi").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.id_trx").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.sifat_surat").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.id_nomor").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.nomor_surat").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.tanggal_surat").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.nip_pembuat").notEmpty().withMessage(" Harus diisi dan array"),
  check("dokumen.*.nip_penandatangan").isArray().notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.email_penandatangan").notEmpty().withMessage(" Harus diisi"),
];