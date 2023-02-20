const debug = require("log4js");
const logger = debug.getLogger();
const refSBMPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_perjalanan_dinas");
const { jsonFormat } = require("../../../utils/jsonFormat");
const { Op } = require("sequelize");

const sbmUangHarian = async (req, res, next) => {
  const params = req.params;
  let kategori_skema = params.kategori_skema
  if (kategori_skema === "GABUNGAN"){
    kategori_skema = {[Op.in]:["LUAR KOTA","DIKLAT"]}
  }
    try {
      let response = await refSBMPerjadin.findOne({
        where: {
          kode_provinsi: params.kode_tempat_tujuan.substring(0, 5),
          kategori_skema: kategori_skema,
          kategori_sbm: "UANG_HARIAN_DALAM_NEGERI",
        },
      });
      jsonFormat(res, "success", "Successfully", response);
    } catch (err) {
      logger.debug(`database SBMUangHarian catch : ${err}`);
      logger.error(`database SBMUangHarian catch : ${err}`);
      next(err);
    }
};

module.exports = sbmUangHarian;
