const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/monitoringdata/monitoring_data");

router.get("/perjalanan-dinas", Controller.perjalanandinas);
router.get("/honorarium", Controller.perjalananhonorarium);

module.exports = router;
