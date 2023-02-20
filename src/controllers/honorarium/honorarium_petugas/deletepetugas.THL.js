const petugasHonorarium = require("../../../models/trx_petugas_honorarium/trx_petugas_honorarium_all");
const SuratTugasHonor = require("../../../models/ref_surat_tugas_honor");
const { jsonFormat } = require("../../../utils/jsonFormat");
const db = require("../../../config/database");
const debug = require("log4js");
const logger = debug.getLogger();

const DeletePetugas = (req, res, next) => {
  db.transaction()
    .then((t) => {
      return petugasHonorarium
        .findOne({
          where: { kode_trx: req.body.kode_trx },
          include: {
            model: SuratTugasHonor,
            as: "surat_tugas",
            include: "status",
          },
        })
        .then((dataPetugas) => {
          if (!!dataPetugas === false || dataPetugas.surat_tugas.status > 2) {
            throw new Error(
              "Data Tidak ada ? Status surat sudah mencapai pengajuan PPK"
            );
          }
          return petugasHonorarium
            .destroy({ where: { kode_trx: req.body.kode_trx }, transaction: t })
            .then((hapusPetugas) => {
              t.commit();
              jsonFormat(res, "success", "Berhasil Menghapus", dataPetugas);
            });
        })
        .catch((err) => {
          t.rollback();
          return err;
        });
    })
    .catch((err) => {
      return err;
    });
}

module.exports = DeletePetugas;