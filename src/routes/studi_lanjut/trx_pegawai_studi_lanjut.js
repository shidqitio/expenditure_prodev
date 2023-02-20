const express = require("express");
const router = express.Router();
const {
    index, 
    showById,
    store, 
    update, 
    destroy
} = require("../../controllers/studi_lanjut/trx_studi_lanjut");
// const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
// const { validationResult } = require("express-validator");
// const { jsonFormat } = require("../utils/jsonFormat");
// const validate = require("../utils/validation");

router.get("/", index)
router.get("/trx-studilanjut/:id",showById)
router.post("/trx-studilanjut/add", store)
router.put("/trx-studilanjut/put/:id", update)
router.delete("/trx-studilanjut/delete/:id",destroy)

module.exports = router;