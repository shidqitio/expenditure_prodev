const express = require("express");
const router = express.Router();
const {
    getByUnit, 
    updateDanaSisa
} = require("../../controllers/UP/ref_dana_awal_up");
// const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
// const { validationResult } = require("express-validator");
// const { jsonFormat } = require("../utils/jsonFormat");
// const validate = require("../utils/validation");

router.get("/get-by-unit/:id", getByUnit)
router.put("/update-dana-up/:id", updateDanaSisa)

module.exports = router;