const SuratTugasHonor = require("../../../models/ref_surat_tugas_honor")
const {jsonFormat} = require("../../../utils/jsonFormat")
const debug = require("log4js");
const logger = debug.getLogger();

const updateStatus = (req,res,next) =>{
  SuratTugasHonor.update({kode_status:1},{where:{id_surat_panutan:req.body.id_surat}}).then((data)=>{
    if (data == 0) {
      throw Error("Tidak ada status surat yang diupdate");
    }
    jsonFormat(res, "success", "Berhasil", data);
  }).catch((err)=>{
      logger.debug(`database updateStatus catch : ${err}`);
      logger.error(`database updateStatus catch : ${err}`);
    jsonFormat(res,"failed",err.message,[])
  })
}

module.exports = updateStatus