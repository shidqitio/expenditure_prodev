const { check } = require("express-validator");

exports.show = [
    check("kode_surat").exists().withMessage("params kode_surat harus ada."),
    check("tahun").exists().withMessage("params tahun harus ada."),
  ];

exports.showPetugas = [
    check("kode_trx").exists().withMessage("params kode_trx harus ada."),
  ];

exports.BelumDiproses = [
    check("id_sub_unit").exists().withMessage("params id_sub_unit harus ada."),
    check("jenis_honor").exists().withMessage("params jenis_honor harus ada."),
    check("nama").exists().withMessage("params nama harus ada."),
]

exports.store = [
    check("id_surat").notEmpty().withMessage("id_surat harus ada."),
    check("tahun").notEmpty().withMessage("tahun harus ada."),
    check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi "),
    check("kode_kegiatan_ut_detail").notEmpty().withMessage("kode_kegiatan_ut_detail harus di isi"),
    check("kode_aktivitas_rkatu").notEmpty().withMessage("kode_aktivitas_rkatu harus di isi"),
    check("kode_rka").notEmpty().withMessage("kode_rka harus di isi"),
    check("kode_periode").notEmpty().withMessage("kode_periode harus di isi"),
    check("nomor_surat").notEmpty().withMessage("nomor_surat harus di isi"),
    check("tanggal_surat").notEmpty().withMessage("tanggal_surat harus di isi"),
    check("kode_unit").notEmpty().withMessage("kode_unit harus di isi"),
    check("perihal").notEmpty().withMessage("perihal harus di isi"),
    check("penandatangan").notEmpty().withMessage("penandatangan harus di isi"),
    check("path_sk").notEmpty().withMessage("path_sk harus ada."),
    check("kode_status").notEmpty().withMessage("kode_status harus ada."),
    check("jenis_honor").notEmpty().withMessage("jenis_honor harus ada."),
    check("nama_honor").notEmpty().withMessage("nama_honor harus ada."),
    // check("data_pengusulan").notEmpty().isIn(['DATA-MANISKU','DATA-EXPENDITURE']).withMessage("data_pengusulan harus di isi. ['DATA-MANISKU'|'DATA-EXPENDITURE']"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

  exports.storePetugas = [
    check("fk_kode_trx_surat").notEmpty().withMessage("fk_kode_trx_surat harus ada."),
    check("kode_surat").notEmpty().withMessage("kode_surat harus di isi "),
    check("tahun").notEmpty().withMessage("tahun harus ada."),
    check("dataPetugas").notEmpty().isArray().withMessage("dataPetugas harus diisi dan berbentuk array"),
    check("dataPetugas.*.nip").notEmpty().withMessage("dataPetugas.*.nip harus di isi"),
    check("dataPetugas.*.tugas").notEmpty().withMessage("dataPetugas.*.tugas harus di isi"),
    check("dataPetugas.*.nama").notEmpty().withMessage("dataPetugas.*.nama harus di isi"),
    check("dataPetugas.*.gol").notEmpty().withMessage("dataPetugas.*.gol harus di isi"),
    check("dataPetugas.*.satuan_biaya").notEmpty().withMessage("dataPetugas.*.satuan_biaya harus di isi"),
    check("dataPetugas.*.satuan_1").notEmpty().withMessage("dataPetugas.*.satuan_1 harus di isi"),
    check("dataPetugas.*.volume_1").notEmpty().withMessage("dataPetugas.*.volume_1 harus di isi"),
    check("dataPetugas.*.satuan_2").notEmpty().withMessage("dataPetugas.*.satuan_2 harus di isi"),
    check("dataPetugas.*.volume_2").notEmpty().withMessage("dataPetugas.*.volume_2 harus di isi"),
    check("dataPetugas.*.jumlah_biaya").notEmpty().withMessage("dataPetugas.*.jumlah_biaya harus di isi"),
    check("dataPetugas.*.pajak").notEmpty().withMessage("dataPetugas.*.pajak harus di isi"),
    check("dataPetugas.*.diterima").notEmpty().withMessage("dataPetugas.*.diterima harus di isi"),
    check("dataPetugas.*.kode_bank").notEmpty().withMessage("dataPetugas.*.kode_bank harus di isi"),
    check("dataPetugas.*.nama_bank").notEmpty().withMessage("dataPetugas.*.nama_bank harus di isi"),
    check("dataPetugas.*.no_rekening").notEmpty().withMessage("dataPetugas.*.no_rekening harus di isi"),
    check("dataPetugas.*.atas_nama_rekening").notEmpty().withMessage("dataPetugas.*.atas_nama_rekening harus di isi"),
    check("dataPetugas.*.keterangan").notEmpty().withMessage("dataPetugas.*.keterangan harus di isi"),
    check("ucr").notEmpty().withMessage("ucr harus di isi."),
  ];

exports.getnomor = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus ada."),
  check("nomor_surat_tugas").notEmpty().withMessage("nomor_surat_tugas harus ada."),
  check("modul").notEmpty().withMessage("modul harus ada."),
  check("kode_rkatu").notEmpty().withMessage("kode_rkatu harus ada."),
  check("bulan_rkatu").notEmpty().withMessage("bulan_rkatu harus ada."),
  check("nominal").notEmpty().withMessage("nominal harus ada."),
  check("kode_unit").notEmpty().withMessage("kode_unit harus ada."),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus ada."),
  check("id_user").notEmpty().withMessage("id_user harus ada."),
  check("tahun").notEmpty().withMessage("tahun harus ada."),
  check("tanggal").notEmpty().withMessage("tanggal harus ada."),
  check("ucr").notEmpty().withMessage("ucr harus ada."),
  check("dokumen").notEmpty().isArray().withMessage("dokumen harus ada dan berbentuk array."),
  check("dokumen.*.sifat_surat").notEmpty().withMessage("dokumen.*.sifat_surat harus ada."),
  check("dokumen.*.id_jenis_surat").notEmpty().withMessage("dokumen.*.id_jenis_surat harus ada."),
  check("dokumen.*.id_jenis_nd").notEmpty().withMessage("dokumen.*.id_jenis_nd harus ada."),
  check("dokumen.*.perihal").notEmpty().withMessage("dokumen.*.perihal harus ada."),
  check("dokumen.*.id_klasifikasi").notEmpty().withMessage("dokumen.*.id_klasifikasi harus ada."),
  check("dokumen.*.katagori_surat").notEmpty().withMessage("dokumen.*.katagori_surat harus ada."),
  check("dokumen.*.jenis_surat").notEmpty().withMessage("dokumen.*.jenis_surat harus ada."),
]

exports.renderKirim = [
  check("nama_honor").notEmpty().withMessage("nama_honor harus ada."),
  check("tahun").notEmpty().isInt().withMessage("tahun harus ada dan int."),
  check("dokumen").notEmpty().isArray().withMessage("dokumen harus ada dan berbentuk array."),
  check("dokumen.*.scriptHtml").notEmpty().withMessage("dokumen.*.scriptHtml harus ada."),
  check("dokumen.*.id_trx").notEmpty().withMessage("dokumen.*.id_trx harus ada."),
  check("dokumen.*.sifat_surat").notEmpty().withMessage("dokumen.*.sifat_surat harus ada."),
  check("dokumen.*.nomor_surat").notEmpty().withMessage("dokumen.*.nomor_surat harus ada."),
  check("dokumen.*.perihal").notEmpty().withMessage("dokumen.*.perihal harus ada."),
  check("dokumen.*.tanggal_surat").notEmpty().withMessage("dokumen.*.tanggal_surat harus ada."),
  check("dokumen.*.nip_pembuat").notEmpty().withMessage("dokumen.*.nip_pembuat harus ada."),
  check("dokumen.*.nip_penandatangan").notEmpty().isArray().withMessage("dokumen.*.nip_penandatangan harus ada dan berbentuk array."),
  check("dokumen.*.email_penandatangan").notEmpty().withMessage("dokumen.*.email_penandatangan harus ada."),
]

exports.storeHonorPanitiaPanutan = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("dataPanitia").notEmpty().isArray().withMessage("dataPanitia harus di isi dan harus array"),
  check("dataPanitia.*.nip").notEmpty().withMessage("dataPanitia.*.nip harus di isi."),
  check("dataPanitia.*.nama").notEmpty().withMessage("dataPanitia.*.nama harus di isi."),
  check("dataPanitia.*.tugas").notEmpty().withMessage("dataPanitia.*.tugas harus di isi."),
  check("dataPanitia.*.gol").notEmpty().withMessage("dataPanitia.*.gol harus di isi."),
  check("dataPanitia.*.satuan").notEmpty().withMessage("dataPanitia.*.satuan harus di isi."),
  check("dataPanitia.*.volume").notEmpty().withMessage("dataPanitia.*.volume harus di isi."),
  check("dataPanitia.*.npwp").notEmpty().withMessage("dataPanitia.*.npwp harus di isi."),
  check("dataPanitia.*.status_npwp").notEmpty().withMessage("dataPanitia.*.status_npwp harus di isi."),
  check("dataPanitia.*.kode_bank").notEmpty().withMessage("dataPanitia.*.kode_bank harus di isi."),
  check("dataPanitia.*.nama_bank").notEmpty().withMessage("dataPanitia.*.nama_bank harus di isi."),
  check("dataPanitia.*.no_rekening").notEmpty().withMessage("dataPanitia.*.no_rekening harus di isi."),
  check("dataPanitia.*.atas_nama_rekening").notEmpty().withMessage("dataPanitia.*.atas_nama_rekening harus di isi."),
  check("dataPanitia.*.keterangan").notEmpty().withMessage("dataPanitia.*.keterangan harus di isi.")
]

exports.storeSKpanutan = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("jenis_honor").notEmpty().withMessage("jenis_honor harus di isi."),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus di isi."),
  check("nomor_surat").notEmpty().withMessage("nomor_surat harus di isi."),
  check("tanggal_surat").notEmpty().withMessage("tanggal_surat harus di isi."),
  check("perihal").notEmpty().withMessage("perihal harus di isi."),
  check("penandatangan").notEmpty().withMessage("penandatangan harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
]

exports.storeHonorPengisiPanutan = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("dataPanitia").notEmpty().isArray().withMessage("dataPanitia harus di isi dan harus array"),
  check("dataPanitia.*.nip").notEmpty().withMessage("dataPanitia.*.nip harus di isi."),
  check("dataPanitia.*.nama").notEmpty().withMessage("dataPanitia.*.nama harus di isi."),
  check("dataPanitia.*.tugas").notEmpty().withMessage("dataPanitia.*.tugas harus di isi."),
  check("dataPanitia.*.jabatan").notEmpty().withMessage("dataPanitia.*.jabatan harus di isi."),
  check("dataPanitia.*.eselon").notEmpty().withMessage("dataPanitia.*.eselon harus di isi."),
  check("dataPanitia.*.npwp").notEmpty().withMessage("dataPanitia.*.npwp harus di isi."),
  check("dataPanitia.*.kode_bank").notEmpty().withMessage("dataPanitia.*.kode_bank harus di isi."),
  check("dataPanitia.*.nama_bank").notEmpty().withMessage("dataPanitia.*.nama_bank harus di isi."),
  check("dataPanitia.*.no_rekening").notEmpty().withMessage("dataPanitia.*.no_rekening harus di isi."),
  check("dataPanitia.*.atas_nama_rekening").notEmpty().withMessage("dataPanitia.*.atas_nama_rekening harus di isi."),
  check("dataPanitia.*.keterangan").notEmpty().withMessage("dataPanitia.*.keterangan harus di isi.")
]

exports.storeHonorPenulisSoal = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("dataPanitia").notEmpty().isArray().withMessage("dataPanitia harus di isi dan harus array"),
  check("dataPanitia.*.nip").notEmpty().withMessage("dataPanitia.*.nip harus di isi."),
  check("dataPanitia.*.nama").notEmpty().withMessage("dataPanitia.*.nama harus di isi."),
  check("dataPanitia.*.tugas").notEmpty().withMessage("dataPanitia.*.tugas harus di isi."),
  check("dataPanitia.*.gol").notEmpty().withMessage("dataPanitia.*.gol harus di isi."),
  check("dataPanitia.*.kode_mk").notEmpty().withMessage("dataPanitia.*.kode_mk harus di isi."),
  check("dataPanitia.*.nama_mk").notEmpty().withMessage("dataPanitia.*.nama_mk harus di isi."),
  check("dataPanitia.*.npwp").notEmpty().withMessage("dataPanitia.*.npwp harus di isi."),
  check("dataPanitia.*.kode_bank").notEmpty().withMessage("dataPanitia.*.kode_bank harus di isi."),
  check("dataPanitia.*.nama_bank").notEmpty().withMessage("dataPanitia.*.nama_bank harus di isi."),
  check("dataPanitia.*.no_rekening").notEmpty().withMessage("dataPanitia.*.no_rekening harus di isi."),
  check("dataPanitia.*.atas_nama_rekening").notEmpty().withMessage("dataPanitia.*.atas_nama_rekening harus di isi."),
  check("dataPanitia.*.keterangan").notEmpty().withMessage("dataPanitia.*.keterangan harus di isi.")
]

exports.editSK = [
  check("kode_surat").exists().withMessage("params kode_surat harus di isi."),
  check("tahun").exists().withMessage("params tahun harus di isi."),
  check("perihal").notEmpty().withMessage("perihal harus di isi."),
  check("penandatangan").notEmpty().withMessage("penandatangan harus di isi."),
  check("path_sk").notEmpty().withMessage("path_sk harus di isi."),
  check("jenis_honor").notEmpty().withMessage("jenis_honor harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi.")
]

exports.UpdateSKStatus = [
  check("id_surat_tugas").exists().withMessage("params id_surat_tugas harus di isi."),
  check("tahun").exists().withMessage("params tahun harus di isi."),
  check("kode_status").notEmpty().isInt().withMessage("kode_status harus di isi dengan INT."),
]

exports.InputRKA = [
  check("kode_surat").exists().withMessage("params kode_surat harus di isi."),
  check("tahun").exists().withMessage("params tahun harus di isi."),
  check("kode_kegiatan_ut_detail").notEmpty().withMessage("kode_kegiatan_ut_detail harus di isi."),
  check("kode_aktivitas_rkatu").notEmpty().withMessage("kode_aktivitas_rkatu harus di isi."),
  check("kode_rka").notEmpty().withMessage("kode_rka harus di isi."),
  check("kode_periode").notEmpty().withMessage("kode_periode harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi.")
]

exports.getnomorSPM = [
  check("id_surat_tugas").notEmpty().withMessage("id_surat_tugas harus ada."),
  check("kode_unit").notEmpty().withMessage("kode_unit harus ada."),
  check("id_sub_unit").notEmpty().withMessage("id_sub_unit harus ada."),
  check("id_user").notEmpty().withMessage("id_user harus ada."),
  check("tahun").notEmpty().withMessage("tahun harus ada."),
  check("tanggal").notEmpty().withMessage("tanggal harus ada."),
  check("ucr").notEmpty().withMessage("ucr harus ada."),
  check("sifat_surat").notEmpty().withMessage("sifat_surat harus ada."),
  check("id_jenis_surat").notEmpty().withMessage("id_jenis_surat harus ada."),
  check("id_jenis_nd").notEmpty().withMessage("id_jenis_nd harus ada."),
  check("perihal").notEmpty().withMessage("perihal harus ada."),
  check("id_klasifikasi").notEmpty().withMessage("id_klasifikasi harus ada."),
  check("katagori_surat").notEmpty().withMessage("katagori_surat harus ada."),
  check("jenis_surat").notEmpty().withMessage("jenis_surat harus ada."),
]

exports.renderKirimSPM = [
  check("nama_honor").notEmpty().withMessage("nama_honor harus ada."),
  check("tahun").notEmpty().isInt().withMessage("tahun harus ada dan int."),
  check("scriptHtml").notEmpty().withMessage("scriptHtml harus ada."),
  check("id_trx").notEmpty().withMessage("id_trx harus ada."),
  check("sifat_surat").notEmpty().withMessage("sifat_surat harus ada."),
  check("nomor_surat").notEmpty().withMessage("nomor_surat harus ada."),
  check("perihal").notEmpty().withMessage("perihal harus ada."),
  check("tanggal_surat").notEmpty().withMessage("tanggal_surat harus ada."),
  check("nip_pembuat").notEmpty().withMessage("nip_pembuat harus ada."),
  check("nip_penandatangan").notEmpty().isArray().withMessage("nip_penandatangan harus ada dan berbentuk array."),
  check("email_penandatangan").notEmpty().withMessage("email_penandatangan harus ada."),
]

exports.storeHonorPengisiPanutannew = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("dataPengisi").notEmpty().isArray().withMessage("dataPengisi harus di isi dan harus array"),
  check("dataPengisi.*.nip").notEmpty().withMessage("dataPengisi.*.nip harus di isi."),
  check("dataPengisi.*.nama").notEmpty().withMessage("dataPengisi.*.nama harus di isi."),
  check("dataPengisi.*.tugas").notEmpty().withMessage("dataPengisi.*.tugas harus di isi."),
  check("dataPengisi.*.jabatan").notEmpty().withMessage("dataPengisi.*.jabatan harus di isi."),
  check("dataPengisi.*.eselon").notEmpty().isIn(['-','I','II','III','IV']).withMessage("dataPengisi.*.eselon harus di isi dengan (['-','I','II','III','IV'])."),
  check("dataPengisi.*.npwp").notEmpty().withMessage("dataPengisi.*.npwp harus di isi."),
  check("dataPanitia.*.gol").notEmpty().isIn(['-','I','II','III','IV']).withMessage(`dataPanitia.*.gol harus di isi dengan (['-','I','II','III','IV'])`),
  check("dataPanitia.*.status_npwp").notEmpty().isIn(['WITH-NPWP','WITHOUT-NPWP']).withMessage("dataPanitia.*.status_npwp harus di isi dengan ('WITH-NPWP','WITHOUT-NPWP')"),
  check("dataPengisi.*.satuan_1").notEmpty().withMessage("dataPengisi.*.satuan_1 harus di isi."),
  check("dataPengisi.*.volume_1").notEmpty().isInt().withMessage("dataPengisi.*.volume_1 harus di isi."),
  check("dataPengisi.*.satuan_2").notEmpty().withMessage("dataPengisi.*.satuan_2 harus di isi."),
  check("dataPengisi.*.volume_2").notEmpty().isInt().withMessage("dataPengisi.*.volume_2 harus di isi."),
  check("dataPengisi.*.kode_bank").notEmpty().withMessage("dataPengisi.*.kode_bank harus di isi."),
  check("dataPengisi.*.nama_bank").notEmpty().withMessage("dataPdataPengisianitia.*.nama_bank harus di isi."),
  check("dataPengisi.*.no_rekening").notEmpty().withMessage("dataPengisi.*.no_rekening harus di isi."),
  check("dataPengisi.*.atas_nama_rekening").notEmpty().withMessage("dataPengisi.*.atas_nama_rekening harus di isi."),
  check("dataPengisi.*.keterangan").notEmpty().withMessage("dataPengisi.*.keterangan harus di isi.")
]

exports.storeHonorTutorPanutan = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("nama_honor").notEmpty().withMessage("nama_honor harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
  check("dataTutor")
    .notEmpty()
    .isArray()
    .withMessage("dataTutor harus di isi dan harus array"),
  check("dataTutor.*.nip")
    .notEmpty()
    .withMessage("dataTutor.*.nip harus di isi."),
  check("dataTutor.*.nama")
    .notEmpty()
    .withMessage("dataTutor.*.nama harus di isi."),
  check("dataTutor.*.tugas")
    .notEmpty()
    .withMessage("dataTutor.*.tugas harus di isi."),
  check("dataTutor.*.jabatan")
    .notEmpty()
    .withMessage("dataTutor.*.jabatan harus di isi."),
  check("dataTutor.*.gol")
    .notEmpty()
    .withMessage("dataTutor.*.gol harus di isi."),
  check("dataTutor.*.npwp")
    .notEmpty()
    .withMessage("dataTutor.*.npwp harus di isi."),
  check("dataTutor.*.email")
    .notEmpty()
    .withMessage("dataTutor.*.email harus di isi."),
  check("dataTutor.*.status_npwp")
    .notEmpty()
    .withMessage("dataTutor.*.status_npwp harus di isi."),
  check("dataTutor.*.kelas_ke")
    .notEmpty()
    .withMessage("dataTutor.*.kelas_ke harus di isi."),
  check("dataTutor.*.keterangan_izin_kelas")
    .notEmpty()
    .withMessage("dataTutor.*.keterangan_izin_kelas harus di isi."),
  check("dataTutor.*.satuan_biaya")
    .notEmpty()
    .withMessage("dataTutor.*.satuan_biaya harus di isi."),
  check("dataTutor.*.kode_mk")
    .notEmpty()
    .withMessage("dataTutor.*.kode_mk harus di isi."),
  check("dataTutor.*.nama_mk")
    .notEmpty()
    .withMessage("dataTutor.*.nama_mk harus di isi."),
  check("dataTutor.*.kode_tutor")
    .notEmpty()
    .withMessage("dataTutor.*.kode_tutor harus di isi."),
  check("dataTutor.*.kode_tutorial")
    .notEmpty()
    .withMessage("dataTutor.*.kode_tutorial harus di isi."),
  check("dataTutor.*.institusi_tutor")
    .notEmpty()
    .withMessage("dataTutor.*.institusi_tutor harus di isi."),
  check("dataTutor.*.tempat_pelaksanaan")
    .notEmpty()
    .withMessage("dataTutor.*.tempat_pelaksanaan harus di isi."),
  check("dataTutor.*.masa")
    .notEmpty()
    .withMessage("dataTutor.*.masa harus di isi."),
  check("dataTutor.*.jumlah_mhs")
    .notEmpty()
    .withMessage("dataTutor.*.jumlah_mhs harus di isi."),
  check("dataTutor.*.satuan")
    .notEmpty()
    .withMessage("dataTutor.*.satuan harus di isi."),
  check("dataTutor.*.jenjang_ngajar")
    .notEmpty()
    .withMessage("dataTutor.*.jenjang_ngajar harus di isi."),
  check("dataTutor.*.volume")
    .notEmpty()
    .withMessage("dataTutor.*.volume harus di isi."),
  check("dataTutor.*.kode_bank")
    .notEmpty()
    .withMessage("dataTutor.*.kode_bank harus di isi."),
  check("dataTutor.*.nama_bank")
    .notEmpty()
    .withMessage("dataTutor.*.nama_bank harus di isi."),
  check("dataTutor.*.no_rekening")
    .notEmpty()
    .withMessage("dataTutor.*.no_rekening harus di isi."),
  check("dataTutor.*.atas_nama_rekening")
    .notEmpty()
    .withMessage("dataTutor.*.atas_nama_rekening harus di isi."),
];

exports.storeHonorariumPetugasPanutan = [
  check("kode_surat").notEmpty().withMessage("kode_surat harus di isi."),
  check("kode_klasifikasi")
    .notEmpty()
    .withMessage("kode_klasifikasi harus di isi."),
  check("tahun").notEmpty().withMessage("tahun harus di isi."),
  check("ucr").notEmpty().withMessage("ucr harus di isi."),
  check("dataPetugas")
    .notEmpty()
    .isArray()
    .withMessage("dataPetugas harus di isi dan harus array"),
  check("dataPetugas.*.nip")
    .notEmpty()
    .withMessage("dataPetugas.*.nip harus di isi."),
  check("dataPetugas.*.nama")
    .notEmpty()
    .withMessage("dataPetugas.*.nama harus di isi."),
  check("dataPetugas.*.tugas")
    .notEmpty()
    .withMessage("dataPetugas.*.tugas harus di isi."),
  check("dataPetugas.*.jabatan")
    .notEmpty()
    .withMessage("dataPetugas.*.jabatan harus di isi."),
  check("dataPetugas.*.gol")
    .notEmpty()
    .isIn(["-", "I", "II", "III", "IV"])
    .withMessage("dataPetugas.*.gol harus di isi. ('-','I','II','III','IV')"),
  check("dataPetugas.*.eselon")
    .notEmpty()
    .isIn(["-", "I", "II", "III", "IV"])
    .withMessage("dataPetugas.*.eselon harus di isi.('-','I','II','III','IV')"),
  check("dataPetugas.*.jenjang")
    .notEmpty()
    .withMessage("dataPetugas.*.jenjang harus di isi."),
  check("dataPetugas.*.katagori")
    .notEmpty()
    .withMessage("dataPetugas.*.katagori harus di isi."),
  check("dataPetugas.*.npwp")
    .notEmpty()
    .withMessage("dataPetugas.*.npwp harus di isi."),
  check("dataPetugas.*.email")
    .notEmpty()
    .withMessage("dataPetugas.*.email harus di isi."),
  check("dataPetugas.*.status_npwp")
    .notEmpty()
    .isIn(["WITHOUT-NPWP", "WITH-NPWP"])
    .withMessage(
      "dataPetugas.*.status_npwp harus di isi.('WITHOUT-NPWP','WITH-NPWP')"
    ),
  check("dataPetugas.*.satuan_1")
    .notEmpty()
    .withMessage("dataPetugas.*.satuan_1 harus di isi."),
  check("dataPetugas.*.volume_1")
    .notEmpty()
    .isInt()
    .withMessage("dataPetugas.*.volume_1 harus di isi."),
  check("dataPetugas.*.satuan_2")
    .notEmpty()
    .withMessage("dataPetugas.*.satuan_2 harus di isi."),
  check("dataPetugas.*.volume_2")
    .notEmpty()
    .isInt()
    .withMessage("dataPetugas.*.volume_2 harus di isi."),
  check("dataPetugas.*.kode_bank")
    .notEmpty()
    .withMessage("dataPetugas.*.kode_bank harus di isi."),
  check("dataPetugas.*.nama_bank")
    .notEmpty()
    .withMessage("dataPetugas.*.nama_bank harus di isi."),
  check("dataPetugas.*.no_rekening")
    .notEmpty()
    .withMessage("dataPetugas.*.no_rekening harus di isi."),
  check("dataPetugas.*.atas_nama_rekening")
    .notEmpty()
    .withMessage("dataPetugas.*.atas_nama_rekening harus di isi."),
];


exports.updateNominalPetugasHonor = [
  check("kode_trx").exists().withMessage("params kode_trx harus di isi."),
  check("satuan_biaya").notEmpty().isInt().withMessage("satuan biaya tidak boleh kosong dan diisi oleh angka")
]