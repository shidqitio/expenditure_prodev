const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const refSbmTransporPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_transpor_perjadin");
const refPerjalanan = require("../../../models/perjalanan_dinas/ref_perjalanan");
const trxPerjalananSbm = require("../../../models/perjalanan_dinas/trx_perjalanan_sbm");
const { jsonFormat } = require("../../../utils/jsonFormat");
const sbmTranspor = async (req, res, next) => {
  const params = req.params;
  try {
    let response;
    if (params.kode_tempat_asal === "ID.36.05") {
      response = await refSbmTransporPerjadin.findAll({
        where: {
          kode_tempat_asal: params.kode_tempat_asal.substring(0, 5),
          kode_tempat_tujuan: params.kode_tempat_tujuan,
          katagori_sbm: "TRANSPOR KHUSUS UT PUSAT",
        },
      });
      if (response.length > 0) {
        return jsonFormat(res, "success", "Successfully", response);
      }
    }

    if (params.kode_tempat_asal === params.kode_tempat_tujuan) {
      let response = await refSbmTransporPerjadin.findOne({
        where: { katagori_sbm: "TRANSPOR LOKAL" },
      });
      jsonFormat(res, "success", "Successfully", response);
    } else if (
      params.kode_tempat_asal.substring(0, 5) ===
      params.kode_tempat_tujuan.substring(0, 5)
    ) {
      response = await refSbmTransporPerjadin.findOne({
        where: {
          kode_tempat_asal: params.kode_tempat_asal.substring(0, 5),
          kode_tempat_tujuan: params.kode_tempat_tujuan,
          katagori_sbm: "DALAM PROVINSI",
        },
      });
      jsonFormat(res, "success", "Successfully", response);
    } else {
      perjalan = await refPerjalanan.findOne({
        where: {
          kode_tempat_asal: {
            [Op.in]: [params.kode_tempat_asal, params.kode_tempat_tujuan],
          },
          kode_tempat_tujuan: {
            [Op.in]: [params.kode_tempat_asal, params.kode_tempat_tujuan],
          },
          transpor: params.transpor,
        },
        include: {
          model: trxPerjalananSbm,
          as: "trxSbm",
          include: {
            model: refSbmTransporPerjadin,
            as: "sbmTranspor",
          },
        },
      });
      let arrSBM = [];

      if (perjalan == null) {
        return jsonFormat(res, "failed", "Tidak ada data transpor!");
      }

      perjalan.trxSbm.map((trx) => {
            arrSBM.push(trx.sbmTranspor);
      });

      jsonFormat(res, "success", "Successfully", arrSBM);
    }
  } catch (err) {
      logger.debug(`database SBMTranspor catch : ${err}`);
      logger.error(`database SBMTranspor catch : ${err}`);
      next(err);
  }
};

module.exports = sbmTranspor;
