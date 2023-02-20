const express = require("express");
const router = express.Router();
const {
    getbynipkatagori,getselesaibynipkatagori,verifikasiunit,verifikasikeuangan
} = require("../controllers/trx_verifikasi_surat");
const verifikasiSchame = require("../request/trx_verifikasi_surat");
const validate = require("../utils/validation");

router.get("/:nip/:katagori",getbynipkatagori);
router.get("/selesai/:nip/:katagori", getselesaibynipkatagori);
router.post("/verifikasi-unit", verifikasiSchame.verifikasiunit,validate.process,verifikasiunit);
router.post("/verifikasi-keuangan", verifikasiSchame.verifikasikeuangan,validate.process,verifikasikeuangan);

module.exports = router;