const express = require("express");
const router = express.Router();
const { getAll,
    getbyprimarykey,
    getbykodeprovinsi,
    create,
    update,
    deleteData } = require("../controllers/ref_geo_kabko");
const kabkoSchema = require("../request/ref_geo_kabko");
const validate = require("../utils/validation");


// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_kabko/:kode_kabko", getbyprimarykey);
router.get("/getbykodeprovinsi/kode_provinsi/:kode_provinsi",getbykodeprovinsi);
router.post("/", kabkoSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_kabko/:kode_kabko",kabkoSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_kabko/:kode_kabko", deleteData);
module.exports = router;
