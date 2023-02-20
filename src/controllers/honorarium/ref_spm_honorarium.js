const { jsonFormat } = require("../../utils/jsonFormat");
const request = require("request");
const SuratTugasHonor = require("../../models/ref_surat_tugas_honor");
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan");
const { QueryTypes,Op, where,fn,col,query } = require("sequelize");
// const sequelize = require("sequelize");
const db = require("../../config/database");
const { replace } = require("lodash");

const listSPMHonor = async(req,res,next) =>{
    try{
       let surat = await db.query(
         `SELECT * FROM (SELECT id_surat_tugas,COUNT(id_trx) AS jumlah_TTE,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.jenis_honor = :jenis_honor 
       AND a.nama_honor = :nama_honor
       AND a.data_pengusulan = "TRANSAKSI-BARU"
       GROUP BY  b.id_surat_tugas) a WHERE jumlah_TTE > 2`,
         {
           replacements: {
             jenis_honor: req.params.jenis_honor,
             nama_honor: req.params.nama_honor,
             tahun: req.params.tahun,
             kode_status: [3, 4, 5, 6],
           },
           type: QueryTypes.SELECT,
         }
       );
       if(surat.length == 0){
        throw new Error("data tidak ditemukan")
       }
       jsonFormat(res,'success','Berhasil menampilkan data',surat)
    }catch(err){
        next(err)
    }
}

const listSPMHonorByUnitTahun = async (req, res, next) => {
  try {
    let surat = await db.query(
      `SELECT * FROM (SELECT id_surat_tugas,COUNT(id_trx) AS jumlah_TTE,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.data_pengusulan = "TRANSAKSI-BARU"
       AND a.id_sub_unit = :id_sub_unit
       GROUP BY  b.id_surat_tugas) a WHERE jumlah_TTE > 2`,
      {
        replacements: {
          id_sub_unit: req.params.id_sub_unit,
          tahun: req.params.tahun,
          kode_status: [3, 4, 5, 6, 7, 8, 9],
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


const listSPMHonorSelesai = async(req,res,next)=>{
    try{
        let surat = await SuratTugasHonor.findAll({where:{jenis_honor: req.params.jenis_honor,
            nama_honor:req.params.nama_honor,
            tahun:req.params.tahun,
            kode_status:{[Op.gt]:4}
        }})
        jsonFormat(res,'success','Berhasil menampilkan data',surat)
    }catch(err){
        next(err)
    }
}


const listSPMHonorSudahTTE = async(req,res,next) =>{
    try{
       let surat = await db.query(`SELECT id_surat_tugas,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.jenis_honor = :jenis_honor 
       AND a.nama_honor = :nama_honor
       GROUP BY  b.id_surat_tugas`,
       {replacements: { jenis_honor: req.params.jenis_honor,
        nama_honor:req.params.nama_honor,
        tahun:req.params.tahun,
        kode_status:[5,6,7,8,9,10,11]
     }
        ,type:QueryTypes.SELECT}
       )
       if(surat.length == 0){
        throw new Error("data tidak ditemukan")
       }
       jsonFormat(res,'success','Berhasil menampilkan data',surat)
    }catch(err){
        next(err)
    }
}

const listSPMHonorByUnit = async (req, res, next) => {
  try {
    let surat = await db.query(
      `SELECT * FROM (SELECT id_surat_tugas,COUNT(id_trx) AS jumlah_TTE,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (1,2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.kode_unit = :kode_unit
       GROUP BY  b.id_surat_tugas) a WHERE jumlah_TTE > 3`,
      {
        replacements: {
          jenis_honor: req.params.jenis_honor,
          nama_honor: req.params.nama_honor,
          kode_unit: req.params.kode_unit,
          tahun: req.params.tahun,
          kode_status: [3, 4, 5, 6, 8, 9, 10],
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

const listSPMHonorSelesaiByUnit = async (req, res, next) => {
  try {
    let surat = await SuratTugasHonor.findAll({
      where: {
        jenis_honor: req.params.jenis_honor,
        nama_honor: req.params.nama_honor,
        tahun: req.params.tahun,
        kode_unit:req.params.kode_unit,
        kode_status: { [Op.gt]: 4 },
      },
    });
    jsonFormat(res, "success", "Berhasil menampilkan data", surat);
  } catch (err) {
    next(err);
  }
};

const listSPMHonorSudahTTEByUnit = async (req, res, next) => {
  try {
    let surat = await db.query(
      `SELECT id_surat_tugas,
       a.tahun,
       kode_surat,id_surat_panutan,id_sub_unit,kode_kegiatan_ut_detail,kode_aktivitas_rkatu,
       kode_rka,kode_periode,nomor_surat,tanggal_surat,a.kode_unit,perihal,penandatangan,path_sk,a.kode_status,jenis_honor,
       nama_honor,keterangan_status
        FROM trx_dokumen_kirim_ke_panutan b INNER JOIN ref_surat_tugas_honor a 
       ON a.kode_surat = b.id_surat_tugas LEFT JOIN ref_status c
       ON c.kode_status = a.kode_status
       WHERE b.aktif IN (2) AND a.kode_status IN(:kode_status) AND a.tahun = :tahun 
       AND a.jenis_honor = :jenis_honor 
       AND a.nama_honor = :nama_honor
       AND a.kode_unit = :kode_unit
       AND a.data_pengusulan = "TRANSAKSI-BARU"
       GROUP BY  b.id_surat_tugas`,
      {
        replacements: {
          jenis_honor: req.params.jenis_honor,
          nama_honor: req.params.nama_honor,
          tahun: req.params.tahun,
          kode_unit: req.params.kode_unit,
          kode_status: [5, 6, 7],
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


module.exports = {
  listSPMHonor,
  listSPMHonorSelesai,
  listSPMHonorSudahTTE,
  listSPMHonorByUnit,
  listSPMHonorSelesaiByUnit,
  listSPMHonorSudahTTEByUnit,
  listSPMHonorByUnitTahun,
};