const express = require("express");
const router = express.Router();
const {
    index, 
    showByKode, 
    showByJenjang
} = require("../../controllers/studi_lanjut/ref_sbm_studi_lanjut");
// const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
// const { validationResult } = require("express-validator");
// const { jsonFormat } = require("../utils/jsonFormat");
// const validate = require("../utils/validation");

router.get("/", index)
router.get("/studilanjut-kode/:id",showByKode)
router.get("/studilanjut-jenjang/:id", showByJenjang)


module.exports = router;