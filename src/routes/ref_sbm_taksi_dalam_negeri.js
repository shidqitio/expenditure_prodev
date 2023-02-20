const express = require("express");
const router = express.Router();
const { getAll,
    getbykodeprovinsi,
    create,
    update,
    deleteData } = require("../controllers/ref_sbm_taksi_dalam_negeri");
const SbmTaksiDalamNegeriSchema = require("../request/ref_sbm_taksi_dalam_negeri");
const validate = require("../utils/validation");


// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbykodeprovinsi/kode_provinsi/:kode_provinsi",getbykodeprovinsi);
router.post("/", SbmTaksiDalamNegeriSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_provinsi/:kode_provinsi",SbmTaksiDalamNegeriSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_provinsi/:kode_provinsi", deleteData);
module.exports = router;
