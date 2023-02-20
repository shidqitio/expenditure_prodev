const express = require("express");
const router = express.Router();
const { getAll,
    getbykodeprovinsi,
    create,
    update,
    deleteData } = require("../controllers/ref_sbm_uang_penginapan");
const SbmUangPenginapanSchema = require("../request/ref_sbm_uang_penginapan");
const validate = require("../utils/validation");

// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbykodeprovinsi/kode_provinsi/:kode_provinsi",getbykodeprovinsi);
router.post("/", SbmUangPenginapanSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_provinsi/:kode_provinsi",SbmUangPenginapanSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_provinsi/:kode_provinsi", deleteData);
module.exports = router;
