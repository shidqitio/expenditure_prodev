const express = require("express");
const router = express.Router();
const { getbytahun,getbytahunkodeunit} = require("../controllers/ref_uang_persediaan");

router.get("/pertahun/:tahun", getbytahun);
router.get("/pertahun-perunit/:tahun/:kode_unit", getbytahunkodeunit);

module.exports = router;
