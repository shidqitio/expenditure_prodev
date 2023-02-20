const debug = require("log4js");
const logger = debug.getLogger();
const { Op } = require("sequelize");
const { jsonFormat } = require("../../../utils/jsonFormat");

const terapkanBiaya = async (req, res, next) => {
    const data = req.body.data
    jsonFormat(res, "success", "successfully", "Sabar yaa belum tidur tunggu 30 menit!");
}
module.exports = terapkanBiaya;

