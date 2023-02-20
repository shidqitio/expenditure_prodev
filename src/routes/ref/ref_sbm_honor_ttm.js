const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_honor_ttm");
const dataValidation = require("../../request/ref/ref_sbm_honor_ttm")

router.get("/", dataController.index);
router.get("/show/:tugas/:jenjang/:jabatan",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:tugas/:jenjang/:jabatan",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;