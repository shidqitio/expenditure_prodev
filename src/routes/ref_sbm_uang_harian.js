const express = require("express");
const router = express.Router();
const { getAll,
    getbyprimarykey,
    getbykodeprovinsi,
    create,
    update,
    deleteData } = require("../controllers/ref_sbm_uang_harian");
const SbmUangharianSchema = require("../request/ref_sbm_uang_harian");
const validate = require("../utils/validation");

// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_provinsi/:kode_provinsi", getbyprimarykey);
router.get("/getbykodeprovinsi/kode_provinsi/:kode_provinsi",getbykodeprovinsi);
router.post("/", SbmUangharianSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_provinsi/:kode_provinsi",SbmUangharianSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_provinsi/:kode_provinsi", deleteData);
module.exports = router;
