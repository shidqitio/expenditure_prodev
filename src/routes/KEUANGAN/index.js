const express = require("express");
const router = express.Router();
const SPM = require("./SPM")

router.use("/SPM", SPM);

module.exports = router;
