const express = require("express");
const router = express.Router();
const dataController = require("../../controllers/panutan/klasifikasi_honor");

router.get("/:id",dataController.show)

module.exports = router;