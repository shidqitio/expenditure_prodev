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
  check("ucr").notEmpty().withMessage("User create harus di ada."),
  check("surat").isArray().withMessage("surat harus dalam bentuk array"),
 check("surat.*.katagori_surat").notEmpty().withMessage("katagori_surat harus di isi"),
 check("surat.*.sifat_surat").notEmpty().withMessage("sifat_surat harus di isi"),
 check("surat.*.id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus di isi"),
 check("surat.*.id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus di isi"),
 check("surat.*.perihal").notEmpty().withMessage("perihal harus di isi"),
 check("surat.*.id_klasifikasi").notEmpty().withMessage("id_klasifikasi harus di isi"),
];

//         'katagori_surat':req.body.katagori_surat,
//         'sifat_surat':req.body.sifat_surat,
//         'id_jenis_surat':req.body.id_jenis_surat,
//         'id_jenis_nd':req.body.id_jenis_nd,
//         'perihal':req.body.perihal,
//         'id_klasifikasi':req.body.id_klasifikasi    


// exports.render = [
//   check(dokumen).
// ]



// 'dokumen':req.body.dokumen,
//     'scriptHtml':req.body.scriptHtml,
//     'id_jenis_surat':req.body.id_jenis_surat,
//     'id_jenis_nd':req.body.id_jenis_nd,
//     'perihal':req.body.perihal,
//     'id_klasifikasi':req.body.id_klasifikasi , 
//     'id_trx':req.body.id_trx,
//     'sifat_surat':req.body.sifat_surat,
//     'id_nomor':req.body.id_nomor,
//     'nomor_surat':req.body.nomor_surat,
//     'perihal':req.body.perihal,
//     'tanggal_surat':req.body.tanggal_surat,
//     'nip_penandatangan':req.body.nip_penandatangan,
//     'email_penandatangan':req.body.email_penandatangan,

exports.kirimdanrender = [
  check("nomor_rekening_dipakai").notEmpty().withMessage("nomor_rekening_dipakai Harus diisi"),
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas Harus diisi"),
  check("tahun").notEmpty().withMessage("tahun Harus diisi"),
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
  check("dokumen.*.nip_pembuat").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.nip_penandatangan").notEmpty().withMessage(" Harus diisi"),
  check("dokumen.*.email_penandatangan").notEmpty().withMessage(" Harus diisi"),
];