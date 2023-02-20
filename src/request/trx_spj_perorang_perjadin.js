const { check } = require("express-validator");

exports.create = [
    check("kode_surat").notEmpty().withMessage("kode_surat tidak boleh kosong"),
    check("nip").notEmpty().withMessage("nip tidak boleh kosong"),
    check("nama").notEmpty().withMessage("nama tidak boleh kosong"),
    check("kode_kota_tujuan").notEmpty().withMessage("kode_kota_tujuan tidak boleh kosong"),
    check("nominal").notEmpty().withMessage("nominal dirubah tidak boleh kosong"),
    check("kode_bank").notEmpty().withMessage("kode_bank tidak boleh kosong"),
    check("device").notEmpty().withMessage("device tidak boleh kosong"),
    check("browser").notEmpty().withMessage("browser tidak boleh kosong"),
    check("location").notEmpty().withMessage("location dirubah tidak boleh kosong"),
    check("kode_unit").notEmpty().withMessage("kode_unit tidak boleh kosong"),
    check("kode_rka").notEmpty().withMessage("kode_rka tidak boleh kosong"),
    check("kode_periode").notEmpty().withMessage("kode_periode tidak boleh kosong"),
    check("nomor_surat_tugas").notEmpty().withMessage("nomor_surat_tugas tidak boleh kosong"),
    check("tanggal_surat").notEmpty().withMessage("tanggal_surat tidak boleh kosong"),
    check("kota_tujuan").notEmpty().withMessage("kota_tujuan dirubah tidak boleh kosong"),
    check("ucr").notEmpty().withMessage("ucr tidak boleh kosong"),
]

exports.createAtcost = [
  check("kodeSurat").notEmpty().withMessage("kodeSurat tidak boleh kosong"),
  check("kodeTrx").notEmpty().withMessage("kodeTrx tidak boleh kosong"),
  check("noSurat").notEmpty().withMessage("noSurat tidak boleh kosong"),
  check("nip").notEmpty().withMessage("nip tidak boleh kosong"),
  check("kodeKotaTujuan")
    .notEmpty()
    .withMessage("kodeKotaTujuan tidak boleh kosong"),
  check("perihal").notEmpty().withMessage("perihal tidak boleh kosong"),
  check("tanggalSurat")
    .notEmpty()
    .withMessage("tanggalSurat tidak boleh kosong"),
  check("kodeUnit").notEmpty().withMessage("kodeUnit tidak boleh kosong"),
  check("tahun").notEmpty().withMessage("tahun tidak boleh kosong"),
  check("status").notEmpty().withMessage("status tidak boleh kosong"),
  check("ucr").notEmpty().withMessage("status tidak boleh kosong"),
];

//  "kodeTrx":21,
//     "kodeSurat":"957",
//     "noSurat":"-",
//     "nip":"197902192006041001",
//     "kodeKotaTujuan":"ID.36.05.01",
//     "perihal":"-",
//     "tanggalSurat":"2022-02-07",
//     "kodeUnit":"UN31.UPBJ",
//     "tahun":2023,
//     "status":2,
//     "ucr":"ridho"