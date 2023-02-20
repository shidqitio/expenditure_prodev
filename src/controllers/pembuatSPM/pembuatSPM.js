const SuratTugasHonor = require("../../models/ref_surat_tugas_honor");
const PerjalananDinas = require("../../models/ref_surat_tugas_perjadin");
const db = require("../../config/database");
const { QueryTypes } = require("sequelize");
const { jsonFormat } = require("../../utils/jsonFormat");

exports.listSPMHonor = async (req, res, next) => {
  try {
    let surat = await db.query(
      `SELECT a.*,psp.nama_unit FROM (SELECT b.id_surat_tugas,COUNT(id_trx) AS jumlah_TTE,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.data_pengusulan = "TRANSAKSI-BARU" 
       GROUP BY  b.id_surat_tugas) a INNER JOIN ref_pembuatspm psp 
       ON psp.id_sub_unit = a.id_sub_unit
     WHERE jumlah_TTE IN (3,4,5) AND psp.id_user = :id_user
    GROUP BY a.id_surat_tugas`,
      {
        replacements: {
          tahun: req.params.tahun,
          kode_status: [3, 4, 5, ],
          id_user: req.params.id_user,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (surat.length == 0) {
      throw new Error("data tidak ditemukan");
    }
    jsonFormat(res, "success", "Berhasil menampilkan data", surat);
  } catch (err) {
    next(err);
  }
};

exports.listSPMPerjadin = async (req, res, next) => {
  try {
    let surat = await db.query(
      `SELECT a.*,psp.nama_unit FROM (SELECT a.*,COUNT(id_trx) AS jumlah_TTE
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_perjadin a 
       ON a.id_surat_tugas = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.data_pengusulan = "TRANSAKSI-BARU" 
       GROUP BY  b.id_surat_tugas) a  INNER JOIN ref_pembuatspm psp 
       ON psp.kode_unit = a.kode_unit WHERE jumlah_TTE IN (3,4,5) AND psp.id_user = :id_user
      GROUP BY a.id_surat_tugas`,
      {
        replacements: {
          tahun: req.params.tahun,
          kode_status: [3, 4, 5],
          id_user: req.params.id_user,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (surat.length == 0) {
      throw new Error("data tidak ditemukan");
    }
    jsonFormat(res, "success", "Berhasil menampilkan data", surat);
  } catch (err) {
    next(err);
  }
};

exports.listSPMTTE = async (req,res,next) =>{
  
}