const express = require("express");
const router = express.Router();
const {
    transferExpenditureController,getlisttransferbyId,getAlltransfer
    ,getlisttransferbykodebank,updateStatusTransfer,siakun,transfer,transferNew
} = require("../controllers/trx_transfer_expenditure");
const transferexpenditureSchame = require("../request/trx_transfer_expenditure");
const { validationResult } = require("express-validator");
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");

router.post("/transfer-create", transferexpenditureSchame.verifikasitransfer,validate.process,transferExpenditureController);
router.get("/get-list-by-id/:nip/:kode_surat/:kode_sub_surat", getlisttransferbyId);
router.put("/update-transfer-bank/:nip/:kode_surat/:kode_sub_surat",transferexpenditureSchame.updatestatustransfer,validate.process, updateStatusTransfer);
router.get("/transfer-all-get", getAlltransfer);
router.post("/transfer-new", transferNew);
router.get("/data-untuk-bank/:kode_bank", getlisttransferbykodebank);
router.post("/integrasi-siakun",transferexpenditureSchame.verifikasisiakun,validate.process ,siakun);
router.post("/transfer",transferexpenditureSchame.transfer,validate.process ,transfer)

module.exports = router;