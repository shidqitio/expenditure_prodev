const { check } = require("express-validator");

exports.penguranganrka = [
  check("kode_RKA").notEmpty().withMessage("kode RKA harus di isi."),
  check("kode_periode").notEmpty().withMessage("kode periode harus di isi."),
  check("id_surat_tugas").notEmpty().withMessage("id surat tugas harus di isi."),
  check("kode_aktivitas_rkatu").notEmpty().withMessage("kode_aktivitas_rkatu  harus di isi."),
  check("jumlah_budget").notEmpty().withMessage("jumlah_budget harus di ada."),
  check("kode_kegiatan_ut_detail").notEmpty().withMessage("kode_kegiatan_ut_detail harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("tanggal_surat_tugas").notEmpty().withMessage("tanggal_surat_tugas harus di isi."),
  check("tanggal").notEmpty().withMessage("tanggal harus di isi."),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
  check("surat").isArray().withMessage("surat harus dalam bentuk array"),
 check("surat.*.katagori_surat").notEmpty().withMessage("katagori_surat harus di isi"),
 check("surat.*.sifat_surat").notEmpty().withMessage("sifat_surat harus di isi"),
 check("surat.*.id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus di isi"),
 check("surat.*.id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus di isi"),
 check("surat.*.perihal").notEmpty().withMessage("perihal harus di isi"),
 check("surat.*.id_klasifikasi").notEmpty().withMessage("id_klasifikasi harus di isi"),
];


exports.kirimdanrender = [
  check("dokumen").notEmpty().withMessage(" Harus diisi"),
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
  check("dokumen.*.nip_penandatangan").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.email_penandatangan").notEmpty().withMessage(" Harus diisi"),
 
];