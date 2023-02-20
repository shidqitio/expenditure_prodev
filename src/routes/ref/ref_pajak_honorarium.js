const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_pajak_honorarium");
const dataValidation = require("../../request/ref/ref_pajak_honorarium")

router.get("/", dataController.index);
router.get("/show/:golongan/:status_npwp",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:golongan/:status_npwp",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;