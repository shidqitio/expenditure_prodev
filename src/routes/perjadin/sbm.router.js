const express = require("express");
const router = express.Router();

const {sbmTransporList, sbmTranspor, sbmPenginapan, sbmUangHarian} = require("../../controllers/perjalanan_dinas/SBM");

router.get("/transpor-list/:kode_tempat_asal/:kode_tempat_tujuan/", sbmTransporList);
router.get("/transpor/:kode_tempat_asal/:kode_tempat_tujuan/:transpor", sbmTranspor);
router.get("/penginapan/:eselon/:gol/:kode_tempat_tujuan", sbmPenginapan);
router.get("/uang-harian/:kode_tempat_tujuan/:kategori_skema", sbmUangHarian);

module.exports = router;