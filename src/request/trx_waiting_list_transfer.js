const { check } = require("express-validator");

exports.verifikasiwaitingtransfer = [
  check("transfer").notEmpty().withMessage("transfer harus di isi."),
  check("transfer").isArray().withMessage("transfer harus berbentuk array."),
  check("transfer.*.tanggal_spm").notEmpty().withMessage("tanggal_spm Harus diisi"),
  check("transfer.*.kode_nomor_spm").notEmpty().withMessage("kode_nomor_spm Harus diisi"),
  check("transfer.*.nomor_spm").notEmpty().withMessage("nomor_spm Harus diisi"),
  check("transfer.*.nip").notEmpty().withMessage("nip Harus diisi"),
  check("transfer.*.nama").notEmpty().withMessage("nama Harus diisi"),
  check("transfer.*.tahun").notEmpty().withMessage("tahun Harus diisi"),
  check("transfer.*.nomor_rekening").notEmpty().withMessage("nomor_rekening Harus diisi"),
  check("transfer.*.kode_rka").notEmpty().withMessage("kode_rka Harus diisi"),
  check("transfer.*.kode_periode").notEmpty().withMessage("kode_periode Harus diisi"),
  check("transfer.*.nama_bank").notEmpty().withMessage("nama_bank Harus diisi"),
  check("transfer.*.kode_bank").notEmpty().withMessage("kode_bank Harus diisi"),
  check("transfer.*.jumlah").notEmpty().withMessage("jumlah Harus diisi"),
  check("transfer.*.pajak_potongan").notEmpty().withMessage("pajak_potongan Harus diisi"),
  check("transfer.*.kode_surat").notEmpty().withMessage("kode_surat Harus diisi"),
  check("transfer.*.sub_surat").notEmpty().withMessage("sub_surat Harus diisi"),
  check("transfer.*.kode_unit").notEmpty().withMessage("kode_unit Harus diisi"),
  check("transfer.*.MAK").notEmpty().withMessage("MAK Harus diisi"),
  check("transfer.*.akun_bas_rka").notEmpty().withMessage("akun_bas_rka Harus diisi"),
  check("transfer.*.akun_bas_realisasi").notEmpty().withMessage("akun_bas_realisasi Harus diisi"),
  check("transfer.*.perihal").notEmpty().withMessage("perihal Harus diisi"),
  check("transfer.*.ucr").notEmpty().withMessage("ucr Harus diisi"),
];
 
exports.merubahstatus = [
  check("transfer").notEmpty().withMessage("transfer harus di isi."),
  check("transfer").isArray().withMessage("transfer harus berbentuk array."),
  check("uch").notEmpty().withMessage("uch harus di isi."),
  check("transfer.*.nip").notEmpty().withMessage("nip Harus diisi"),
  check("transfer.*.kode_surat").notEmpty().withMessage("kode_surat Harus diisi"),
  check("transfer.*.sub_surat").notEmpty().withMessage("sub_surat Harus diisi"),
  check("transfer.*.status").notEmpty().withMessage("status Harus diisi"),
]

exports.getnomorsptd = [
  check("sifat_surat").notEmpty().withMessage("sifat_surat harus di isi."),
  check("id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus di isi."),
  check("id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus di isi."),
  check("id_klasifikasi").notEmpty().withMessage("id_klasifikasi harus di isi."),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi."),
  check("id_user").notEmpty().withMessage("id_user harus di isi."),
  check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
  check("tanggal").notEmpty().withMessage("tanggal harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("nomor_rekening_asal").notEmpty().withMessage("nomor_rekening_asal harus di isi."),
  check("kode_bank_asal").notEmpty().withMessage("kode_bank_asal harus di isi."),
  check("transfer").notEmpty().withMessage("transfer harus di isi."),
  check("transfer").isArray().withMessage("transfer harus berbentuk array."),
  check("transfer.*.nip").notEmpty().withMessage("nip Harus diisi"),
  check("transfer.*.kode_surat").notEmpty().withMessage("kode_surat Harus diisi"),
  check("transfer.*.sub_surat").notEmpty().withMessage("sub_surat Harus diisi")
]

exports.passUnit = [
  check("datawaiting").notEmpty().withMessage("datawaiting harus di isi."),
  check("datawaiting").isArray().withMessage("datawaiting harus berbentuk array."),
  check("datawaiting.*.nip").notEmpty().withMessage("datawaiting.*.nip harus di isi."),
  check("datawaiting.*.kode_surat").notEmpty().withMessage("datawaiting.*.kode_surat harus di isi."),
  check("datawaiting.*.sub_surat").notEmpty().withMessage("datawaiting.*.sub_surat harus di isi."),
  check("datawaiting.*.uch").notEmpty().withMessage("datawaiting.*.uch harus di isi."),
]

exports.renderdankirim = [
  check("tahun").notEmpty().withMessage("Tahun harus diisi"),
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
  check("nip_pembuat").notEmpty().withMessage(" Harus diisi dan array"),
  check("nip_penandatangan").isArray().notEmpty().withMessage(" Harus diisi"),
  check("email_penandatangan").notEmpty().withMessage(" Harus diisi"),
  check("kode_nomor_sptd").notEmpty().withMessage(" Harus diisi"),
  check("kode_surat_trx").notEmpty().withMessage(" Harus diisi"),
];