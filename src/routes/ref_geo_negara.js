const express = require("express");
const router = express.Router();
const { getAll,
    getbyprimarykey,
    create,
    update,
    deleteData } = require("../controllers/ref_geo_negara");
const sbmTransportSchema = require("../request/ref_geo_negara");
const validate = require("../utils/validation");
// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_negara/:kode_negara", getbyprimarykey);
router.post("/", sbmTransportSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_negara/:kode_negara",sbmTransportSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_negara/:kode_negara", deleteData);
module.exports = router;
