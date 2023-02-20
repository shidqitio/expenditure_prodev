const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_honorarium_all");
//const dataValidation = require("../../request/ref/ref_sbm_honor_tutor")

router.get("/", dataController.index);
router.get("/show-klasifikasi/:kode_klasifikasi",dataController.show)
router.get("/show-trx/:kode_trx",dataController.show)
router.put("/edit/:kode_trx",dataController.edit)
router.post("/store",dataController.store)


module.exports = router;