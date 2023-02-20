const { check } = require("express-validator");

exports.verifikasitransfer = [
  check("transfer").notEmpty().withMessage("transfer harus di isi."),
  check("transfer").isArray().withMessage("transfer harus berbentuk array."),
  check("transfer.*.nip").notEmpty().withMessage("nip Harus diisi"),
  check("transfer.*.nama").notEmpty().withMessage("nama Harus diisi"),
  check("transfer.*.nomor_rekening").notEmpty().withMessage("nomor_rekening Harus diisi"),
  check("transfer.*.kode_bank").notEmpty().withMessage("kode bank Harus diisi"),
  check("transfer.*.nama_bank").notEmpty().withMessage("nama bank Harus diisi"),
  check("transfer.*.email").notEmpty().withMessage("email Harus diisi"),
  check("transfer.*.nominal").notEmpty().withMessage("nominal Harus diisi"),
  check("transfer.*.kode_surat").notEmpty().withMessage("kode_surat Harus diisi"),
  check("transfer.*.kode_sub_surat").notEmpty().withMessage("kode_sub_surat Harus diisi"),
  check("transfer.*.perihal").notEmpty().withMessage("perihal Harus diisi"),
  check("transfer.*.ucr").notEmpty().withMessage("UCR Harus diisi"),  
];

exports.updatestatustransfer = [
  check("unit_bank").notEmpty().withMessage("unit_bank tidak boleh kosong"),
  check("waktu_transfer").notEmpty().withMessage("waktu_transfer tidak boleh kosong"),
  check("nama_penentrasfer").notEmpty().withMessage("nama_penentrasfer tidak boleh kosong"),
  check("status").notEmpty().withMessage("status dirubah tidak boleh kosong"),
  check("uch").notEmpty().withMessage("uch tidak boleh kosong")
]

exports.verifikasisiakun = [
  check("tahun").notEmpty().withMessage("tahun harus di isi"),
  check("nomor_rekening_dipakai").notEmpty().withMessage("nomor_rekening_dipakai harus di isi"),
  check("ucr").notEmpty().withMessage("ucr harus di isi"),
  check("transaksi").notEmpty().withMessage("transaksi harus di isi"),
  check("transaksi").isArray().withMessage("transaksi harus berbentuk Array"),
  check("transaksi.*.kode_surat").notEmpty().withMessage("transaksi.*.kode_surat harus di isi."),
  check("transaksi.*.kode_sub_surat").notEmpty().withMessage("transaksi.*.kode_sub_surat harus di isi"),
  check("transaksi.*.tanggal_transaksi").notEmpty().withMessage("transaksi.*.tanggal_transaksi harus di isi"),
  check("transaksi.*.nama_petugas").notEmpty().withMessage("transaksi.*.nama_petugas harus di isi"),
  check("transaksi.*.nip").notEmpty().withMessage("transaksi.*.nip harus di isi"),
  check("transaksi.*.nomor_rekening_tujuan").notEmpty().withMessage("transaksi.*.nomor_rekening_tujuan harus di isi"),
  check("transaksi.*.nominal").notEmpty().withMessage("transaksi.*.nominal harus di isi"),
  check("transaksi.*.kode_rkatu").notEmpty().withMessage("transaksi.*.kode_rkatu harus di isi"),
  check("transaksi.*.bulan_akhir").notEmpty().withMessage("transaksi.*.bulan_akhir harus di isi"),

];


exports.transferold = [
  check("tahun").notEmpty().withMessage("tahun harus di isi"),
  check("kode_bank_asal").notEmpty().withMessage("kode_bank_asal harus di isi"),
  check("nomor_rekening_dipakai").notEmpty().withMessage("nomor_rekening_dipakai harus di isi"),
  check("nomor_sptd").notEmpty().withMessage("nomor_sptd harus di isi"),
  check("ucr").notEmpty().withMessage("ucr harus di isi"),
  check("device").notEmpty().withMessage("device harus di isi"),
  check("browser").notEmpty().withMessage("browser harus di isi"),
  check("location").notEmpty().withMessage("location harus di isi"),
  check("transferData").notEmpty().withMessage("transferData harus di isi"),
  check("transferData").isArray().withMessage("transferData harus berbentuk Array"),
  check("transferData.*.kode_bank_tujuan").notEmpty().withMessage("transferData.*.kode_bank_tujuan harus di isi"),
  check("transferData.*.nomor_rekening_tujuan").notEmpty().withMessage("transferData.*.nomor_rekening_tujuan harus di isi"),
  check("transferData.*.kode_surat").notEmpty().withMessage("transferData.*.kode_surat harus di isi"),
  check("transferData.*.nip").notEmpty().withMessage("transferData.*.nip harus di isi"),
  check("transferData.*.kode_sub_surat").notEmpty().withMessage("transferData.*.kode_sub_surat harus di isi"),
  check("transferData.*.nama_petugas").notEmpty().withMessage("transferData.*.nama_petugas harus di isi"),
  check("transferData.*.kode_rkatu").notEmpty().withMessage("transferData.*.kode_rkatu harus di isi"),
  check("transferData.*.bulan_akhir").notEmpty().withMessage("transferData.*.bulan_akhir harus di isi"),
  check("transferData.*.nomor_surat_tugas").notEmpty().withMessage("transferData.*.nomor_surat_tugas harus di isi"),
  check("transferData.*.akun_bas_realisasi").notEmpty().withMessage("transferData.*.akun_bas_realisasi harus di isi")
]

exports.transfer = [
  check("tahun").notEmpty().withMessage("tahun harus di isi"),
  check("tanggal").notEmpty().withMessage("tanggal harus di isi"),
  check("nomor_sptd").notEmpty().withMessage("nomor_sptd harus di isi"),
  check("kode_bank_asal").notEmpty().withMessage("kode_bank_asal harus di isi"),
  check("transferData.*.kode_bank_asal").notEmpty().withMessage("transferData.*.kode_bank_asal harus di isi"),
  check("transferData.*.nomor_rekening_dipakai").notEmpty().withMessage("transferData.*.nomor_rekening_dipakai harus di isi"),
  check("transferData.*.nomor_sptd").notEmpty().withMessage("transferData.*.nomor_sptd harus di isi"),
  check("ucr").notEmpty().withMessage("ucr harus di isi"),
  check("device").notEmpty().withMessage("device harus di isi"),
  check("browser").notEmpty().withMessage("browser harus di isi"),
  check("location").notEmpty().withMessage("location harus di isi"),
  check("transferData").notEmpty().withMessage("transferData harus di isi"),
  check("transferData").isArray().withMessage("transferData harus berbentuk Array"),
  check("transferData.*.kode_bank_tujuan").notEmpty().withMessage("transferData.*.kode_bank_tujuan harus di isi"),
  check("transferData.*.nomor_rekening_tujuan").notEmpty().withMessage("transferData.*.nomor_rekening_tujuan harus di isi"),
  check("transferData.*.kode_surat").notEmpty().withMessage("transferData.*.kode_surat harus di isi"),
  check("transferData.*.nip").notEmpty().withMessage("transferData.*.nip harus di isi"),
  check("transferData.*.kode_sub_surat").notEmpty().withMessage("transferData.*.kode_sub_surat harus di isi"),
  check("transferData.*.nama_petugas").notEmpty().withMessage("transferData.*.nama_petugas harus di isi"),
  check("transferData.*.kode_rkatu").notEmpty().withMessage("transferData.*.kode_rkatu harus di isi"),
  check("transferData.*.bulan_akhir").notEmpty().withMessage("transferData.*.bulan_akhir harus di isi"),
  check("transferData.*.kode_unit").notEmpty().withMessage("transferData.*.kode_unit harus di isi"),
  check("transferData.*.email").notEmpty().withMessage("transferData.*.email harus di isi"),
  check("transferData.*.nomor_surat_tugas").notEmpty().withMessage("transferData.*.nomor_surat_tugas harus di isi"),
  check("transferData.*.akun_bas_realisasi").notEmpty().withMessage("transferData.*.akun_bas_realisasi harus di isi")
]
