const express = require("express");
const router = express.Router();
const { byunitandmonthnew,byunitandmonthspesifik } = require("../controllers/ref_rka_unit");

router.get("/unit/bulan/:unit/:bulan/:program",byunitandmonthnew);
router.get("/unit-bulan/:unit/:bulan/:program",byunitandmonthspesifik);


module.exports = router;
