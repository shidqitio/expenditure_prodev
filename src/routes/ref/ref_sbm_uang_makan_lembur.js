const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_uang_makan_lembur");
const dataValidation = require("../../request/ref/ref_sbm_uang_makan_lembur")

router.get("/", dataController.index);
router.get("/show/:golongan/:jenis_pegawai/:teknisi",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:golongan/:jenis_pegawai/:teknisi",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;