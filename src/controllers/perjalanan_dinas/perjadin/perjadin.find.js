const debug = require("log4js");
const logger = debug.getLogger();
const { Op, Sequelize } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
const SuratTugasExpenditure = require("../../../models/ref_surat_expenditure");
const PerjalananPetugas = require("../../../models/perjalanan_dinas/ref_perjalanan_petugas");
const KomentarRevisi = require("../../../models/komentar_revisi");
const KomponenPerjadin = require("../../../models/trx_komponen_perjadin");
const PetugasPerjadin = require("../../../models/trx_petugas_perjadin");
const trxSbmTranspor = require("../../../models/perjalanan_dinas/trx_sbm_transpor");
const trxSbmPenginapan = require("../../../models/perjalanan_dinas/trx_sbm_penginapan");
const trxSbmUangharian = require("../../../models/perjalanan_dinas/trx_sbm_uangharian");
const refKabko = require("../../../models/ref_geo_kabko");

const PerjadinFindNest = (req, res, next) => {
  const id = req.params.id_surat;
  SuratTugasPerjadin.findOne({
    where: { id_surat_tugas: id },
    include: [
      {
        attributes: [
          "kode_surat_header",
            "jenis_surat",
            "kode_surat_relasi",
        ],
        model: SuratTugasExpenditure,
        as: "suratHeader",
        include: {
          model: KomentarRevisi,
          as: "KomentarRevisi",
        },
      },
      // {
      //   model: PerjalananPetugas,
      //   order: [["tanggal_pergi", "ASC"]],
      //   as: "tanggalpergiperjalanan",
      //   attributes: ["tanggal_pergi"],
      //   limit: 1,
      // },
      // {
      //   model: PerjalananPetugas,
      //   order: [["tanggal_pulang", "DESC"]],
      //   as: "tanggalpulangperjalanan",
      //   attributes: ["tanggal_pulang"],
      //   limit: 1,
      // },
      {
        model: PerjalananPetugas,
        as: "perjalananPetugas",
        include: [
          { attributes: ["nama_kabko"], model: refKabko, as: "kabkoAsal" },
          { attributes: ["nama_kabko"], model: refKabko, as: "kabkoTujuan" },
          {
            model: PetugasPerjadin,
            as: "petugasPerjadin",
            include: {
              model: KomponenPerjadin,
              as: "komponenPetugas",
            },
          },
        ],
      },
    ],
  })
    .then(async(result) => {

      return jsonFormat(res, "success", "Berhasil", result);
    })
    .catch((err) => {
      logger.debug(`database perjadinFindNest catch : ${err}`);
      logger.error(`database perjadinFindNest catch : ${err}`);
      next(err);
    });
};

module.exports = PerjadinFindNest;
