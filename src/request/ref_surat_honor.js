const { check } = require("express-validator");

exports.inputPanutan = [
    check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
    check("nomor_surat_tugas").notEmpty().withMessage("nomor_surat_tugas harus di isi."),
    check("tanggal_surat_tugas").notEmpty().withMessage("tanggal_surat_tugas harus di isi."),
    check("tahun").notEmpty().withMessage("tahun harus di isi."),
    check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),
    check("path_sk").notEmpty().withMessage("path_sk harus di isi."),
    // check("data_pengusulan").notEmpty().isIn(['DATA-MANISKU','DATA-EXPENDITURE']).withMessage("data_pengusulan harus di isi. ['DATA-MANISKU'|'DATA-EXPENDITURE']"),
    check("ucr").notEmpty().withMessage("ucr harus di isi.")
];