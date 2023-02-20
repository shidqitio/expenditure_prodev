const express = require("express");
const router = express.Router();
const { getAll,
    getbyprimarykey,
    getbykodenegara,
    create,
    update,
    deleteData } = require("../controllers/ref_geo_provinsi");
const provinsiSchema = require("../request/ref_geo_provinsi");
const validate = require("../utils/validation");


// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_provinsi/:kode_provinsi", getbyprimarykey);
router.get("/getbykodenegara/kode_negara/:kode_negara",getbykodenegara)
router.post("/", provinsiSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_provinsi/:kode_provinsi",provinsiSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_provinsi/:kode_provinsi", deleteData);
module.exports = router;
