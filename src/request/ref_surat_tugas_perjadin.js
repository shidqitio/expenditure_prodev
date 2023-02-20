const { check } = require("express-validator");

exports.create = [
  check("id_surat_tugas").notEmpty().withMessage("id surat harus di isi."),
  check("kode_rka").notEmpty().withMessage("kode_rka harus di isi."),
  check("dokumen").notEmpty().withMessage("dokumen harus di isi."),
  check("kode_kegiatan_ut_detail").notEmpty().withMessage("Kode kegiatan harus di isi."),
  check("kode_unit").notEmpty().withMessage("Kode unit harus di isi."),
  // check("data_pengusulan").notEmpty().isIn(['TRANSAKSI-HISTORIS','TRANSAKSI-BARU']).withMessage("data_pengusulan harus di isi. ['TRANSAKSI-HISTORIS','TRANSAKSI-BARU']"),
  check("ucr").notEmpty().withMessage("User create harus di ada."),
];

exports.createPerjadin = [
  check("id_surat_tugas").notEmpty().withMessage("id surat harus di isi."),
  check("kode_unit").notEmpty().withMessage("Kode unit harus di isi."),
];

exports.update = [];
exports.updatestatus =[
  check("kode_status").notEmpty().withMessage("kode_status harus di isi."),
]

exports.inputRKA = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
  check("kode_kegiatan_ut_detail").notEmpty().withMessage("kode_kegiatan_ut_detail harus di isi."),
  check("kode_aktivitas_rkatu").notEmpty().withMessage("kode_aktivitas_rkatu harus di isi."),
  check("kode_rka").notEmpty().withMessage("kode_rka harus di isi."),
  check("kode_periode").notEmpty().withMessage("kode_periode harus di isi."),
  check("nomor_surat_tugas").notEmpty().withMessage("nomor_surat_tugas harus di isi."),
  check("tanggal_surat_tugas").notEmpty().withMessage("tanggal_surat_tugas harus di isi."),
  check("kode_sub_unit").notEmpty().withMessage("kode_sub_unit harus di isi."),
  check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),
  // check("data_pengusulan").notEmpty().isIn(['TRANSAKSI-HISTORIS','TRANSAKSI-BARU']).withMessage("data_pengusulan harus di isi. ['TRANSAKSI-HISTORIS','TRANSAKSI-BARU']"),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
  check("pegawai").notEmpty().withMessage("pegawai harus di isi."),
  check("pegawai").isArray().withMessage(" pegawai harus array."),
  check("pegawai.*.nip").notEmpty().withMessage("pegawai.nip harus di isi."),
  check("pegawai.*.kode_kota_asal").notEmpty().withMessage("pegawai.kode_kota_asal harus di isi."),
  check("pegawai.*.kode_kota_tujuan").notEmpty().withMessage("pegawai.kode_kota_tujuan harus di isi."),
  check("pegawai.*.nama_petugas").notEmpty().withMessage("pegawai.nama_petugas harus di isi."),
  check("pegawai.*.kode_bank_tujuan").notEmpty().withMessage("pegawai.kode_bank_tujuan harus di isi."),
  check("pegawai.*.nama_bank").notEmpty().withMessage("pegawai.nama_bank harus di isi."),
  check("pegawai.*.nomor_rekening").notEmpty().withMessage("pegawai.nomor_rekening harus di isi."),
  check("pegawai.*.gol").notEmpty().withMessage("pegawai.gol harus di isi."),
  check("pegawai.*.eselon").notEmpty().withMessage("pegawai.eselon harus di isi."),
  check("pegawai.*.npwp").notEmpty().withMessage("pegawai.npwp harus di isi."),
  check("pegawai.*.kode_provinsi_asal").notEmpty().withMessage("pegawai.kode_provinsi_asal harus di isi."),
  check("pegawai.*.kode_provinsi_tujuan").notEmpty().withMessage("pegawai.kode_provinsi_tujuan harus di isi."),
  check("pegawai.*.nama_kota_asal").notEmpty().withMessage("pegawai.nama_kota_asal harus di isi."),
  check("pegawai.*.nama_kota_tujuan").notEmpty().withMessage("pegawai.nama_kota_tujuan harus di isi."),
  check("pegawai.*.tanggal_pergi").notEmpty().withMessage("pegawai.tanggal_pergi harus di isi."),
  check("pegawai.*.tanggal_pulang").notEmpty().withMessage("pegawai.tanggal_pulang harus di isi."),
  check("pegawai.*.lama_perjalanan").notEmpty().withMessage("pegawai.lama_perjalanan harus di isi."),
  check("pegawai.*.keterangan_dinas").notEmpty().withMessage("pegawai.keterangan_dinas harus di isi."),
]

