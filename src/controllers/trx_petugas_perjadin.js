const { jsonFormat } = require("../utils/jsonFormat");
const PetugasPerjadin = require("../models/trx_petugas_perjadin");

exports.getAll = async (req, res, next) => {
  try {
    const data = await PetugasPerjadin.findAll();
    console.log("data", data);
    jsonFormat(res, "success", "Berhasil memuat data", data);
  } catch (error) {
    jsonFormat(res, "failed", error.message, []);
  }
};

exports.create = async (req, res, next) => {
  jsonFormat(res, "success", "Berhasil memuat data", []);
};
exports.update = async (req, res, next) => {
  jsonFormat(res, "success", "Berhasil memuat data", []);
};
