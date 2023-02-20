const express = require("express");
const router = express.Router();
const DataController = require("../../controllers/pevita/pevita");
const DataValidate = require("../../request/pevita/pevita");
const validate = require("../../utils/validation");

router.post("/get-nomor",DataValidate.createnomor,validate.process,DataController.createnomor);

module.exports = router;