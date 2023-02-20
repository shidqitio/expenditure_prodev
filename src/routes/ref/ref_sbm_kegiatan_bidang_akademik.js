const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/ref/ref_sbm_kegiatan_bidang_akademik");
const dataValidation = require("../../request/ref/ref_sbm_kegiatan_bidang_akademik")

router.get("/", dataController.index);
router.get("/show/:bentuk_kegiatan/:sub_kegiatan/:komponen/:kategori",dataValidation.show,validation.process,dataController.show)
router.put("/edit/:bentuk_kegiatan/:sub_kegiatan/:komponen/:kategori",dataValidation.edit,validation.process,dataController.edit)
router.post("/store",dataValidation.store,validation.process,dataController.store)


module.exports = router;