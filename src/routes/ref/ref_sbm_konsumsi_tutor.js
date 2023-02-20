const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_konsumsi_tutor");
const dataValidation = require("../../request/ref/ref_sbm_konsumsi_tutor")

router.get("/", dataController.index);
router.get("/show/:jenjang_ngajar",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:jenjang_ngajar",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;