const debug = require("log4js");
const logger = debug.getLogger();
const refSBMPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_perjalanan_dinas");
const { jsonFormat } = require("../../../utils/jsonFormat");

const sbmPenginapan = async (req, res, next) => {
  const params = req.params;
  let kondisi;
  try {
    if (params.eselon !== "-") {
      kondisi = {
        eselon: params.eselon,
        gol: "-",
        kode_provinsi: params.kode_tempat_tujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    } else if (params.gol !== "-") {
      kondisi = {
        eselon: "-",
        gol: params.gol,
        kode_provinsi: params.kode_tempat_tujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    } else {
      kondisi = {
        eselon: "-",
        gol: "-",
        kode_provinsi: params.kode_tempat_tujuan.substring(0, 5),
        kategori_sbm: "PENGINAPAN",
      };
    }
    let response = await refSBMPerjadin.findOne({ where: kondisi });
    if (!response) {
      jsonFormat(res, "success", "Data not found", response);
    }
    jsonFormat(res, "success", "Successfully", response);
  } catch (err) {
      logger.debug(`database SBMPenginapan catch : ${err}`);
      logger.error(`database SBMPenginapan catch : ${err}`);
    return err;
  }
};

module.exports = sbmPenginapan;
