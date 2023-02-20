const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");
const SuratTugasPerjadin = require("../../../models/ref_surat_tugas_perjadin");
// const { suratTugasPerjadin } = require("../../../services/service.internal");

const perjadinList = async (req, res, next) => {
    const params = req.params;

    const limit = 10;
    const total = await SuratTugasPerjadin.count();
    const totalPages = Math.ceil(total / limit);
    const pages = req.query.page || 1;
    const offset = (pages - 1) * limit;

    var like = '';
    var list = ''; 
    if (req.query.page) {
        like = {
          attributes: [
            "id_surat_tugas",
            "tahun",
            "nomor_surat_tugas",
            "tanggal_surat_tugas",
            "keterangan_perjadin",
            "jumlah_orang",
            "jenis_perjalanan",
            "kode_status",
          ],
          include: ["statusPerjadin"],
          where: {
            jenis_perjalanan: {
              [Op.like]: params.type_of_trip,
            },
          },
          order: [['id_surat_tugas', 'DESC']],
          offset,
          limit: limit,
        };

      list = {
          attributes: [
            "id_surat_tugas",
            "tahun",
            "nomor_surat_tugas",
            "tanggal_surat_tugas",
            "keterangan_perjadin",
            "jumlah_orang",
            "jenis_perjalanan",
            "jenis_kegiatan",
            "kode_status",
          ],
          include: ["statusPerjadin"],
          order: [['id_surat_tugas', 'DESC']],
          offset,
          limit: limit,
        };
    } else {
      like = {
          attributes: [
            "id_surat_tugas",
            "tahun",
            "nomor_surat_tugas",
            "tanggal_surat_tugas",
            "keterangan_perjadin",
            "jumlah_orang",
            "jenis_perjalanan",
            "kode_status",
          ],
          include: ["statusPerjadin"],
          where: {
            jenis_perjalanan: {
              [Op.like]: params.type_of_trip,
            },
          },
          order: [['id_surat_tugas', 'DESC']]
        };

      list = {
          attributes: [
            "id_surat_tugas",
            "tahun",
            "nomor_surat_tugas",
            "tanggal_surat_tugas",
            "keterangan_perjadin",
            "jumlah_orang",
            "jenis_perjalanan",
            "jenis_kegiatan",
            "kode_status",
          ],
          include: ["statusPerjadin"],
          order: [['id_surat_tugas', 'DESC']]
        };
    }

    const response = await SuratTugasPerjadin.findAll(params.type_of_trip ? like : list).then(async(schema) => {
        if (schema.length > 0) {
            jsonFormat(res, "success", "Successfully", schema, {
              total,
              limit,
              pages,
              totalPages,
            });
        } else {
            jsonFormat(res, "success", "Data tidak ditemukan", pages)
        }
    }).catch((err) => {
        logger.debug(`database suratTugasPerjadin catch : ${err}`);
        logger.error(`database suratTugasPerjadin catch : ${err}`);
        next(err)
    })
       
    return response
}

module.exports = perjadinList
