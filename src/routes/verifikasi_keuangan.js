const express = require("express");
const router = express.Router();
const {
  getnomor,
  renderdankirim,
  listverifikasi,
  listverifikasisptd,
  listverifikasibykodeunit
} = require("../controllers/verifikasi_keuangan");
const verifikasiSchame = require("../request/verifikasi_keuangan");
const validate = require("../utils/validation");

router.post("/getnomor", verifikasiSchame.getnomor,validate.process,getnomor);
router.post("/renderdankirim",verifikasiSchame.renderdankirim,validate.process,renderdankirim);
router.get(
  "/list-verifikasi/:tahun/:katagori_surat/:kode_unit",
  listverifikasibykodeunit
);
router.get("/list-verifikasi/:tahun/:katagori_surat",listverifikasi);
router.get("/list-verifikasi-sptd/:tahun/:katagori_surat",listverifikasisptd);

module.exports = router;