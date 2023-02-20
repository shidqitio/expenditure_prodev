const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_konsumsi_kegiatan");
const dataValidation = require("../../request/ref/ref_sbm_konsumsi_kegiatan")

router.get("/", dataController.index);
router.get("/show/:kegiatan/:jenis_konsumsi",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:kegiatan/:jenis_konsumsi",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;