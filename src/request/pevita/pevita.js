const { check } = require("express-validator");


exports.createnomor = [
    check("katagori_surat").notEmpty().withMessage("katagori_surat harus di isi."),
    check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus di isi."),
    check("sifat_surat").notEmpty().withMessage("sifat_surat harus di isi."),
    check("id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus di isi."),
    check("id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus di isi."),
    check("perihal").notEmpty().withMessage("perihal harus di isi."),
    check("id_klasifikasi").notEmpty().withMessage("id_klasifikasi harus di isi."),
    check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi."),
    check("kode_unit").notEmpty().withMessage("kode_unit harus di isi."),
    check("tahun").notEmpty().withMessage("tahun harus di isi."),
    check("id_user").notEmpty().withMessage("id_user harus di isi."),
    check("nama_pembuat").notEmpty().withMessage("nama_pembuat harus di isi."),
    check("type_surat").notEmpty().withMessage("type_surat harus di isi."),
    check("tanggal").notEmpty().withMessage("tanggal harus di isi."),
    check("ucr").notEmpty().withMessage("User create harus di ada."),
  ];