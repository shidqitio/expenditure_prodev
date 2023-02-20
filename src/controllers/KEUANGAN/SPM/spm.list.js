const KeuanganModel = require("../../../models/KEUANGAN")
const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");


const list = (req,res,next) =>{
  const params = req.params;
  const limit = 10;
  const total = KeuanganModel.SuratPerintahMembayar.count();
  const totalPages = Math.ceil(total / limit);
  const pages = req.query.page || 1;
  const offset = (pages - 1) * limit;
      var like = '';
    var list = ''; 
    if (req.query.page) {
        like = {
          attributes: [
          "kode_spm","kode_surat_header","kode_nomor_spm","nomor_spm","link_file","kode_unit","status"
          ],
          where: {
            status: {
              [Op.like]: params.type_of_trip,
            },
          },
          order: [['kode_spm', 'DESC']],
          offset,
          limit: limit,
        };

      list = {
          attributes: [
            "kode_spm","kode_surat_header","kode_nomor_spm","nomor_spm","link_file","kode_unit","status"
          ],
          order: [['kode_spm', 'DESC']],
          offset,
          limit: limit,
        };
    } else {
      like = {
          attributes: [
             "kode_spm","kode_surat_header","kode_nomor_spm","nomor_spm","link_file","kode_unit","status"
          ],
          where: {
            status: {
              [Op.like]: params.type_of_trip,
            },
          },
          order: [['kode_spm', 'DESC']]
        };

      list = {
          attributes: [
            "kode_spm","kode_surat_header","kode_nomor_spm","nomor_spm","link_file","kode_unit","status"
          ],
          order: [['kode_spm', 'DESC']]
        };
    }
  KeuanganModel.SuratPerintahMembayar.findAll(params.type_of_trip ? like : list).then((data)=>{
    if(data.length === 0){
      throw Error("Data tidak ditemukan")
    }
    jsonFormat(res, "success", "Successfully", data, {
              total,
              limit,
              pages,
              totalPages,
            });
  }).catch((err)=>{
        logger.debug(`database ListSPMKeuangan catch : ${err}`);
        logger.error(`database ListSPMKeuangan catch : ${err}`);
        next(err)
  })
}

module.exports = list