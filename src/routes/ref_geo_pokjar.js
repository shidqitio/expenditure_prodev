const express = require("express");
const router = express.Router();
const { getAll,
    getbyprimarykey,
    getbykodekabko,
    create,
    update,
    deleteData } = require("../controllers/ref_geo_pokjar");
const pokjarSchema = require("../request/ref_geo_pokjar");
const validate = require("../utils/validation");


// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_pokjar/:kode_pokjar", getbyprimarykey);
router.get("/getbykodekabko/kode_kabko/:kode_kabko",getbykodekabko)
router.post("/", pokjarSchema.create,validate.process, create);
router.put("/getbyprimarykey/kode_pokjar/:kode_pokjar",pokjarSchema.update,validate.process, update);
router.delete("/getbyprimarykey/kode_pokjar/:kode_pokjar", deleteData);
module.exports = router;
