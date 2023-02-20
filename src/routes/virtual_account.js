const express = require("express");
const router = express.Router();
const DataController = require("../controllers/virtual_account");

router.post("/create",DataController.createVirtualAccount );
router.post("/push-notification/:kode_VA",DataController.pushNotifVA );

module.exports = router;