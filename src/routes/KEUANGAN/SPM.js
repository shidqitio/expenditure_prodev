const express = require("express");
const router = express.Router();
const SPM = require("../../controllers/KEUANGAN/SPM");
router.get("/transaction-keuangan/list/type-of-trip/:type_of_trip", SPM.LIST);
router.get("/transaction-keuangan/show/:id", SPM.SHOW);
router.post("/transaction-keuangan", SPM.CREATE);
module.exports = router;
