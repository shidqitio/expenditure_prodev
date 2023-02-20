const express = require("express");
const router = express.Router();
const refSPMController = require("../../controllers/SPM/ref_spm_perjadin");

router.post("/perjadin/create-nomor",refSPMController.createSPMPerjadin);


module.exports = router;