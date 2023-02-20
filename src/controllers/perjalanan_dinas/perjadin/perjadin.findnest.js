const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
const SuratTugasExpenditure = require("../../../models/ref_surat_expenditure");
const PerjalananPetugas = require("../../../models/perjalanan_dinas/ref_perjalanan_petugas");
const KomentarRevisi = require("../../../models/komentar_revisi")
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const trxSbmTranspor = require("../../../models/perjalanan_dinas/trx_sbm_transpor");
const trxSbmPenginapan = require("../../../models/perjalanan_dinas/trx_sbm_penginapan");
const trxSbmUangharian = require("../../../models/perjalanan_dinas/trx_sbm_uangharian");
const refKabko = require("../../../models/ref_geo_kabko");
const refPerjalanan = require("../../../models/perjalanan_dinas/ref_perjalanan");
const trxPerjalananSbm = require("../../../models/perjalanan_dinas/trx_perjalanan_sbm");
const refSBMPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_perjalanan_dinas");
const refSbmTransporPerjadin = require("../../../models/perjalanan_dinas/ref_sbm_transpor_perjadin");
const sequelize = require("sequelize");

const PerjadinFindNest = (req,res,next) =>{
  const id = req.params.id
  SuratTugasPerjadin.findOne({
    where: { id_surat_tugas: id },
    include: [
      {
        model: SuratTugasExpenditure,
        as: "suratHeader",
        include: {
          model: KomentarRevisi,
          as: "KomentarRevisi",
        },
      },
      {
        model: PerjalananPetugas,
        order: [["tanggal_pergi", "ASC"]],
        as: "tanggalpergiperjalanan",
        attributes: ["tanggal_pergi"],
        limit: 1,
      },
      {
        model: PerjalananPetugas,
        order: [["tanggal_pulang", "DESC"]],
        as: "tanggalpulangperjalanan",
        attributes: ["tanggal_pulang"],
        limit: 1,
      },
      {
        model: PerjalananPetugas,
        as: "perjalananPetugas",
        include: [
          { model: refKabko, as: "kabkoAsal" },
          { model: refKabko, as: "kabkoTujuan" },
          {
            model: PetugasPerjadin,
            as: "petugasPerjadin",
            include: {
              model: KomponenPerjadin,
              as: "KomponenPetugas",
            },
          },
          {
            model: trxSbmTranspor,
            as: "sbmTranspor",
          },
          {
            model: trxSbmPenginapan,
            as: "sbmPenginapan",
          },
          {
            model: trxSbmUangharian,
            as: "sbmUangHarian",
          },
        ],
      },
    ],
  })
    .then((resSurat) => {
      return jsonFormat(res, "success", "Berhasil", resSurat);
    })
    .catch((err) => {
      logger.debug(`database perjadinFindNest catch : ${err}`);
      logger.error(`database perjadinFindNest catch : ${err}`);
      next(err);
    });
}

module.exports = PerjadinFindNest;

// refPerjalanan.findOne({
//   where: {
//     kode_tempat_asal: {
//       [Op.in]: [kodeAsal, kodeTujuan],
//     },
//     kode_tempat_tujuan: {
//       [Op.in]: [kodeAsal, kodeTujuan],
//     },
//     transpor: transpor,
//   },
//   include: {
//     model: trxPerjalananSbm,
//     as: "trxSbm",
//     include: {
//       model: refSbmTransporPerjadin,
//       as: "sbmTranspor",
//     },
//   },
// });