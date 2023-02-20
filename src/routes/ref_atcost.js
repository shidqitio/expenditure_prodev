const express = require("express");
const router = express.Router();
const { getnomorspmatcost,coba,detailSPM,renderSPM } = require("../controllers/ref_atcost");
const atcostScema = require("../request/ref_atcost")
// const {verifyToken,pengusulToken} = require("../milddleware/auth")
const validate = require("../utils/validation");

router.post("/",atcostScema.getNomorSpm,validate.process,getnomorspmatcost);
router.post("/coba",coba);
router.post("/render",renderSPM);
router.get("/detail-spm/:kode_nomor_spm",detailSPM);


module.exports = router;
