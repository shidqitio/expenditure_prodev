const express = require("express");
const router = express.Router();

const perjadin = require("./perjadin.router");
const skema = require("./skema.router");
const sbm = require("./sbm.router");
const surat = require("./surat.tugas.route");

router.use("/sbm", sbm);
router.use("/surat-tugas", surat);
router.use("/skema", skema);
router.use("/usulan", perjadin);

module.exports = router