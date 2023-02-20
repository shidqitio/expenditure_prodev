const { check } = require("express-validator");

exports.perjadinAssignmentSchema = [
    check("tahun").notEmpty().withMessage("tahun harus di isi."),
    check("idSuratTugas").notEmpty().withMessage("idSuratTugas harus di isi."),
    check("nomorSuratTugas").notEmpty().withMessage("nomorSuratTugas harus di isi."),
    check("tanggalSuratTugas").notEmpty().withMessage("tanggalSuratTugas harus di isi."),
    check("jenisKegiatan").notEmpty().withMessage("jenisKegiatan harus di isi."),
    check("jenisPerjalanan").notEmpty().withMessage("jenisPerjalanan harus di isi."),
    check("keteranganPerjadin").notEmpty().withMessage("keteranganPerjadin harus di isi."),
    check("jumlahOrang").notEmpty().withMessage("jumlahOrang harus di isi."),
    check("pathDokumen").notEmpty().withMessage("pathDokumen harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
];
