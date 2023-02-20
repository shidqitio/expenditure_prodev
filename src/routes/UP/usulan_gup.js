const express = require("express");
const router = express.Router();
const {
    store, store_tes, updateKomentar, getNomorSurat, index, updateRka, showNoSurat
} = require("../../controllers/UP/usulan_gup");
// const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
// const { validationResult } = require("express-validator");
// const { jsonFormat } = require("../utils/jsonFormat");
// const validate = require("../utils/validation");
const validate = require("../../utils/validation");
const usulanGupSchema = require("../../request/UP/usulan_gup")

router.post("/", usulanGupSchema.store,validate.process , store)

router.get("/", index);

router.put("/update-status/:id", updateKomentar)

router.get("/get-nomor-surat/:id", getNomorSurat)

router.put("/update-rka/:id", updateRka)

router.get("/show-no-surat/:id", showNoSurat)


router.post("/post-tes", store_tes)



module.exports = router;