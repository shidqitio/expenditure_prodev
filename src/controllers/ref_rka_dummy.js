const axios = require("axios");
const { jsonFormat } = require("../utils/jsonFormat");
const RkaDummy = require("../models/ref_rka_dummy");

exports.getByAkun = async (req, res, next) => {
    try {
        const rka = await RkaDummy.findAll({
          where: {
            akun: req.params.akun,
          },
        });
    
        if (rka.length === 0)
          return jsonFormat(res, "failed", "kode RKA tidak ada", []);
    
        jsonFormat(res, "success", "Berhasil memuat data", rka);
      } catch (error) {
        jsonFormat(res, "failed", error.message, []);
      }
    };
