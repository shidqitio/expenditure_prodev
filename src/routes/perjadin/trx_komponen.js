const express = require("express");
const router = express.Router();
const {
    storeDraft, storeProses, update, destroy
} = require("../../controllers/perjalanan_dinas/perjadin/trx_komponen");
// const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
// const { validationResult } = require("express-validator");
// const { jsonFormat } = require("../utils/jsonFormat");
// const validate = require("../utils/validation");
const validate = require("../../utils/validation");
//const usulanGupSchema = require("../../request/UP/usulan_gup")
const trxkomponenSchema = require("../../request/perjadin/trx-komponen-schema")


router.post("/store-proses/:id", trxkomponenSchema.store, validate.process, storeProses)

router.post("/store-draft/:id", trxkomponenSchema.store, validate.process, storeDraft)

router.put("/update/:id", update)

router.delete("/destroy/:id", destroy)

module.exports = router