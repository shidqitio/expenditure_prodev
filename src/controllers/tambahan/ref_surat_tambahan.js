const refSuratTambahan = require("../../models/ref_surat_tambahan")
const dokumenKirimPanutan = require("../../models/trx_dokumen_kirim_ke_panutan")
const {jsonFormat} = require("../../utils/jsonFormat");
const {Op} = require("sequelize")
const db = require("../../config/database")
const path = require("path")
const hostExpenditure = process.env.hostExpenditure;
const pevita = require("../../utils/pevita")
const renderpdf = require("../../utils/renderpdf")
const siakun = require("../../middleware/siakun")
const fs = require("fs")
const {QueryTypes} = require("sequelize")


exports.index = (req,res,next) =>{
    let arrStatus = req.params.kode_status.split("-")
    refSuratTambahan.findAll({where:{kode_status:{[Op.in]:arrStatus}}}).then((surat)=>{
        jsonFormat(res,"success","berhasil",surat)
    }).catch((err)=>{
        jsonFormat(res,"failed",err.message,[])
    })
}

exports.index2 = (req, res, next) => {
  let arrStatus = req.params.kode_status.split("-");
  let katagori = req.params.katagori.split("-")
  refSuratTambahan
    .findAll({
      where: {
        kode_status: { [Op.in]: arrStatus },
        katagori: { [Op.in]: katagori },
      },
    })
    .then((surat) => {
      jsonFormat(res, "success", "berhasil", surat);
    })
    .catch((err) => {
      jsonFormat(res, "failed", err.message, []);
    });
};

const getlistByheaderPanutan = async (req, res, next) => {
  try {
    let id_sub_unit = req.params.id_sub_unit.split(",", 20);
    let nama_honor = req.params.nama_honor.split(",", 20);
    const honor = await SuratTugasHonor.findAll({
      where: {
        id_sub_unit: { [Op.in]: [id_sub_unit] },
        nama_honor: { [Op.in]: [nama_honor] },
      },
    });
    return jsonFormat(res, "success", "Berhasil Menampilkan Data", honor);
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
};

exports.create = (req,res,next) =>{
     refSuratTambahan.max('kode_trx').then((max)=>{
        let kode_trx = max+1
        let biaya_spp = req.body.biaya_spp
        let ppn = req.body.pph
        let pph = req.body.ppn
        let biaya_akhir = biaya_spp-pph-ppn
        const filename = path.parse(req.file.filename).base;
        let path_file = hostExpenditure+"/archive/storeone/"+filename
        let kode_surat = kode_trx+"-"+req.body.katagori
        let data = {
           kode_trx:kode_trx,
           kode_surat:kode_surat,
           kode_nomor_surat:req.body.kode_nomor_surat,
           nomor_surat:req.body.nomor_surat,
           tahun:req.body.tahun,
           kode_rka:req.body.kode_rka,
           katagori:req.body.katagori,
           kode_periode:req.body.kode_periode,
           tanggal_surat:req.body.tanggal_surat,
           perihal:req.body.perihal,
           kode_unit:req.body.kode_unit,
           penerima_orang_pertama:req.body.penerima_orang_pertama,
           kode_bank:req.body.kode_bank,
           no_rekening:req.body.no_rekening,
           jumlah_penerima:req.body.jumlah_penerima,
           biaya_spp:biaya_spp,
           pph:pph,
           ppn:ppn,
           biaya_akhir:biaya_akhir,
           kode_status:req.body.kode_status,
           ucr:req.body.ucr,
           path_file:path_file
        }
        return refSuratTambahan.create(data).then(async(surat)=>{
           let tokenpevita = await pevita.token()
            pevita.generateNomor(
              surat.kode_surat,
              "Surat Tambahan " + surat.katagori,
              req.body.kode_unit,
              req.body.tahun,
              "SPP",
              "B",
              11,
              3,
              "Surat Tambahan " + surat.katagori,
              545,
              req.body.id_sub_unit,
              req.body.id_user,
              req.body.ucr,
              req.body.tanggal,
              tokenpevita,
              1
            );

            pevita.generateNomor(
              surat.kode_surat,
              "Surat Tambahan " + surat.katagori,
              req.body.kode_unit,
              req.body.tahun,
              "SPTB",
              "B",
              11,
              3,
              "Surat Tambahan " + surat.katagori,
              545,
              req.body.id_sub_unit,
              req.body.id_user,
              req.body.ucr,
              req.body.tanggal,
              tokenpevita,
              2
            );

            siakun.storePagu(
              req.body.tahun,
              "M08.01.01",
              surat.kode_surat,
              req.body.tanggal,
              "B/" +
                surat.kode_surat +
                "/" +
                surat.kode_unit +
                "/" +
                surat.tahun,
              req.body.kode_rka,
              req.body.kode_periode,
              surat.biaya_akhir,
              req.body.ucr
            );

            jsonFormat(res,"success","berhasil",surat)
        })
    })
    .catch((err)=>{
        jsonFormat(res,"success",err.message,[])
    })
}

exports.byid = (req,res,next)=>
{
    refSuratTambahan
      .findOne({
        where: { kode_trx: req.params.kode_trx },
        include: ["tambahan_dokumen"],
      })
      .then((data) => {
        jsonFormat(res, "success", "Berhasil", data);
      })
      .catch((err) => {
        jsonFormat(res, "failed", err.message, []);
      });
}

exports.update = (req,res,next)=>{
  return refSuratTambahan.update(req.body,{where:{kode_trx:req.params.kode_trx}}).then((up)=>{
    jsonFormat(res,"success","Berhasil",up)
  }).catch((err)=>{
    jsonFormat(res,"failed",err.message,[])
  })
}

exports.updatestatus = (req, res, next) => {
  return refSuratTambahan
    .update({kode_status:req.body.kode_status,uch:req.body.uch}, { where: { kode_trx: req.params.kode_trx } })
    .then((up) => {
      jsonFormat(res, "success", "Berhasil", up);
    })
    .catch((err) => {
      jsonFormat(res, "failed", err.message, []);
    });
};

exports.updateRKA = (req,res,next) =>{
  db.transaction().then((t)=>{
  refSuratTambahan.findOne({ where: { kode_trx: req.params.kode_trx },transaction:t })
   .then((surat) => {
     return refSuratTambahan
       .update(
         {
           kode_rka: req.body.kode_rka,
           kode_periode: req.body.kode_periode,
           uch: req.body.uch,
         },
         { where: { kode_trx: req.params.kode_trx }, transaction: t }
       )
       .then(() => {
         siakun.ReversalPagu(
           surat.tahun,
           "M08.01.01",
           surat.kode_surat,
           surat.tanggal,
           "B/" + surat.kode_surat + "/" + surat.kode_unit + "/" + surat.tahun,
           surat.kode_rkatu,
           surat.kode_periode,
           surat.biaya_akhir,
           req.body.uch
         );
         siakun.storePagu(
           surat.tahun,
           "M08.01.01",
           surat.kode_surat,
           surat.tanggal,
           "B/" + surat.kode_surat + "/" + surat.kode_unit + "/" + surat.tahun,
           req.body.kode_rkatu,
           req.body.kode_periode,
           surat.biaya_akhir,
           req.body.uch
         );
         
          t.commit()
         jsonFormat(res, "success", "Berhasil", []);
       });
   })
   .catch((err) => {
    t.rollback()
     next(err);
   });
  })
 
}

exports.updateFile = (req,res,next) =>{
  refSuratTambahan.findOne({where:{kode_trx:req.params.kode_trx}}).then((surat)=>{
    let arrayPath = surat.path_file.split("/")
    let namafile = arrayPath[6]
    let pathpdf = path.join(__dirname, "../public/storeone/", "/" + namafile);
    const filename = path.parse(req.file.filename).base;
    const path_file = hostExpenditure+"/archive/storeone/"+filename
    fs.unlink(pathpdf, (err) => {
      console.log("unlink error", err);
    });
    return refSuratTambahan.update(
      { path_file: path_file,uch:req.body.uch },
      { where: { kode_trx: req.params.kode_trx } }
    ).then((up)=>{
      jsonFormat(res,"success","berhasil",[])
    })
  }).catch((err)=>{
    jsonFormat(res,"failed",err.message,[])
  })
}

exports.listSPM = async(req,res,next) =>{
  try {
    let surat = await db.query(
      `SELECT * FROM ( SELECT COUNT(id_trx) AS jumlah,a.katagori_surat,b.kode_trx,a.id_surat_tugas,a.tahun,a.jenis_surat,
a.tanggal,a.id_nomor,a.nomor,a.id_file,a.link_file,b.perihal,b.kode_rka,b.kode_periode,b.kode_bank,b.no_rekening,
b.penerima_orang_pertama,b.jumlah_penerima,b.biaya_spp,b.ppn,b.pph,b.biaya_akhir,c.keterangan_status
 FROM trx_dokumen_kirim_ke_panutan a INNER JOIN ref_surat_tambahan b
ON a.id_surat_tugas = b.kode_surat 
LEFT JOIN ref_status c
ON b.kode_status = c.kode_status
WHERE b.kode_status IN (:kode_status) AND aktif = :aktif AND b.tahun = :tahun
GROUP BY a.id_surat_tugas ) table_as WHERE jumlah = :jumlah_TTE`,
      {
        replacements: {
          jumlah_TTE: 2,
          aktif: 2,
          tahun: req.params.tahun,
          katagori:req.params.katagori,
          kode_status: [3, 4, 5, 6],
        },
        type: QueryTypes.SELECT,
      }
    );
    if (surat.length == 0) {
      throw new Error("data tidak ditemukan");
    }
    jsonFormat(res, "success", "Berhasil menampilkan data", surat);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
}



