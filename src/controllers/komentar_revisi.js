const komentarRevisi = require("../models/komentar_revisi");
const { jsonFormat } = require("../utils/jsonFormat");
const db = require("../config/database");

exports.store = (req, res, next) => {
  db.transaction().then((t)=>{
    return komentarRevisi.destroy({where:{ kode_surat: req.params.kode_surat },transaction:t}).then((destroy)=>{
      return komentarRevisi.create({
      kode_ruang: req.body.kode_ruang,
      kode_surat: req.params.kode_surat,
      komentar: req.body.komentar,
      aktif: "AKTIF",
      ucr: req.body.ucr,
    },{transaction:t})
    .then((create) => {
      t.commit()
      jsonFormat(res, "success", "Berhasil", create);
    })
    }).catch((err) => {
      t.rollback()
      jsonFormat(res, "failed", err.message, []);
    })
  }).catch((err) => {
      jsonFormat(res, "failed", err.message, []);
    });
};

const updatestatus = (kode_surat) => {
  return komentarRevisi.update(
    { aktif: "NON-AKTIF" },
    { where: { kode_surat: kode_surat } }
  );
};

const deletekomentar = (kode_surat)=>{
  return komentarRevisi.destroy(
    { where: { kode_surat: kode_surat } }
  );
}
