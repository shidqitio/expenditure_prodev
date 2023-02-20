const db = require("../../config/database");
const {jsonFormat} = require("../../utils/jsonFormat")
const {QueryTypes} = require("sequelize");

exports.perjalanandinas = (req,res,next) =>{
  db.query(
    `SELECT a.kode_status,b.keterangan_status,COUNT(a.kode_status) AS jumlah FROM ref_surat_tugas_perjadin a
LEFT JOIN ref_status b
	ON a.kode_status = b.kode_status
  WHERE data_pengusulan = "TRANSAKSI-BARU"
 GROUP BY a.kode_status`,
    {
      type: QueryTypes.SELECT,
    }
  )
    .then((select) => {
      jsonFormat(res, "success", "berhasil", select);
    })
    .catch((err) => {
      jsonFormat(res, "failed", err?.message, select);
    });
}

exports.perjalananhonorarium = (req, res, next) => {
  db.query(
    `SELECT a.kode_status,b.keterangan_status,COUNT(a.kode_status) AS jumlah FROM ref_surat_tugas_honor a
LEFT JOIN ref_status b
	ON a.kode_status = b.kode_status
  WHERE data_pengusulan = "TRANSAKSI-BARU"
 GROUP BY a.kode_status`,
    {
      type: QueryTypes.SELECT,
    }
  )
    .then((select) => {
      jsonFormat(res, "success", "berhasil", select);
    })
    .catch((err) => {
      jsonFormat(res, "failed", err?.message, select);
    });
};

