const pevita = require("../../../utils/pevita")
const db = require("../../../config/database")
const KeuanganModel = require("../../../models/KEUANGAN");
const dokumenKirimPanutan = require("../../../models/trx_dokumen_kirim_ke_panutan")
const { jsonFormat } = require("../../../utils/jsonFormat");

const create = (req,res,next)=>{
  db.transaction().then((t)=>{
    KeuanganModel.SuratPerintahMembayar.create(req.body.spm,{transaction:t})
    .then((dataSPM) => {
      if(!dataSPM){throw new Error('data spm tidak terbuat')}
     return dokumenKirimPanutan.create(req.body.dokumen, { transaction: t });
    }).then((resultDokumen)=>{
      if (!dataSPM) {throw new Error("data dokumen tidak terbuat");}
      t.commit()
      jsonFormat(res,"success","Berhasil",resultDokumen)
    }).catch((err)=>{
      t.rollback()
      next(err)
    })
  })
}
module.exports = create