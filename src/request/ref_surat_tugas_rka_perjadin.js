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
  check("nip_unit_pemaraf").notEmpty().withMessage("nip_unit_pemaraf harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus coba pokonya harus ada di ada."),
  check("nomor_surat_tugas").notEmpty().withMessage("nomor surat tugas harus di isi.")
];

exports.kirimdanrender = [
  check("dokumen").notEmpty().withMessage(" Harus diisi"),
  check("scriptHtml").notEmpty().withMessage("Script Html Harus diisi"),
  check("id_jenis_surat").notEmpty().withMessage("id_jenis_surat Harus diisi"),
  check("jenis_surat").notEmpty().withMessage(" Harus diisi"),
  check("id_jenis_nd").notEmpty().withMessage(" Harus diisi"),
  check("perihal").notEmpty().withMessage(" Harus diisi"),
  check("id_klasifikasi").notEmpty().withMessage(" Harus diisi"),
  check("id_trx").notEmpty().withMessage(" Harus diisi"),
  check("sifat_surat").notEmpty().withMessage(" Harus diisi"),
  check("id_nomor").notEmpty().withMessage(" Harus diisi"),
  check("nomor_surat").notEmpty().withMessage(" Harus diisi"),
  check("tanggal_surat").notEmpty().withMessage(" Harus diisi"),
  check("nip_penandatangan").notEmpty().withMessage(" Harus diisi"),
  check("email_penandatangan").notEmpty().withMessage(" Harus diisi"),
 
];



