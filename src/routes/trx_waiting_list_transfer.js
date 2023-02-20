const express = require("express");
const router = express.Router();
const {
    create,
    listGetAllbystatus,
    getnomor,
    listGetAllbystatusnested,
    merubahstatus,
    listsptdnested,
    sptdbyidnested,
    sptdbyidnestednew,
    rendersptd,
    getPrimaryKey,
    listNestedPerUnit,
    passUnit
} = require("../controllers/trx_waiting_list_transfer")
const waitingTransferSchame = require("../request/trx_waiting_list_transfer")
const validate = require("../utils/validation")
const { validationResult } = require("express-validator")
const { jsonFormat } = require("../utils/jsonFormat")
const {authenticate} = require("../middleware/auth")

router.post("/waiting-transfer-create", waitingTransferSchame.verifikasiwaitingtransfer,validate.process,create);
router.post("/pass-to-unit", waitingTransferSchame.passUnit,validate.process,passUnit);
router.post("/waiting-merubah-status", waitingTransferSchame.merubahstatus,validate.process,merubahstatus);
router.get("/list-get-all/:status",listGetAllbystatus);
router.get("/list-get-all-nested/:status",listGetAllbystatusnested);
router.get("/list-get-all-nested-sptd/:status",listsptdnested);
router.post("/render-sptd",waitingTransferSchame.renderdankirim,validate.process,rendersptd);
router.post("/getnomor",waitingTransferSchame.getnomorsptd,validate.process,getnomor);
router.get("/get-sptd-byid/:kode_surat_trx",sptdbyidnestednew);
router.get("/get-sptd-byid-new/:kode_surat_trx",sptdbyidnestednew);
router.get("/get-by-primary-key/:kode_surat/:kode_sub_surat/:nip",getPrimaryKey);
router.get("/list-unit/:kode_unit",listNestedPerUnit);
module.exports = router;