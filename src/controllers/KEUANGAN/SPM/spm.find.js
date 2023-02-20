const KeuanganModel = require("../../../models/KEUANGAN");
const dokumenKirimPanutan = require("../../../models/trx_dokumen_kirim_ke_panutan");
const SuratExpenditure = require("../../../models/ref_surat_expenditure")
const PerjadinModel = require("../../../models/surat_tugas")
const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");


const find = (req,res,next)=>{
  const id = req.params.id
  KeuanganModel.SuratPerintahMembayar.findOne({
    where: { kode_surat_header: id },
    include: [
      {
        model: SuratExpenditure,
        as: "SuratHeaderSPM",
        include: [
          {
            model: PerjadinModel.SURATTUGASAWAL,
            as: "SuratTugasPerjadin",
          },
          {
            model: dokumenKirimPanutan,
            as: "SuratdokHeader",
          },
        ],
      },
      {
        model: KeuanganModel.TrxSppduSpm,
        as: "spm_to_trx_sppdu",
        include: {
          model: KeuanganModel.SuratPencairanDanaUnit,
          as: "trx_spm_to_sppdu",
        },
      },
      {
        model: KeuanganModel.TrxSptdSpm,
        as: "spm_to_trx_sptd",
        include: {
          model: KeuanganModel.SuratPerintahTransferDana,
          as: "trx_spm_to_sptd",
        },
      },
    ],
  })
    .then((result) => {
      return jsonFormat(res, "success", "Berhasil", result);
    })
    .catch((err) => {
      logger.debug(`database findSPMKeuangan catch : ${err}`);
      logger.error(`database findSPMKeuangan catch : ${err}`);
      next(err);
    });
}

module.exports = find;