const express = require("express");
const router = express.Router();
const controller = require("../../controllers/pembuatSPM/pembuatSPM");

router.get("/perjadin/:tahun/:id_user", controller.listSPMPerjadin);
router.get("/honor/:tahun/:id_user", controller.listSPMHonor);

module.exports = router;