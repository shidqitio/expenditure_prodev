const express = require("express");
const router = express.Router();
const controllers = require("../controllers/komentar_revisi")
const schema = require("../request/komentar_revisi")
const validation = require("../utils/validation")

router.post("/store/:kode_surat", schema.store, validation.process,controllers.store);

module.exports = router;
