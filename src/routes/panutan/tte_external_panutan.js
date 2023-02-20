const express = require("express");
const router = express.Router();
const dataController = require("../../controllers/TTE/tte_external_panutan");

router.post("/triger",dataController.trigerTTE)


module.exports = router;