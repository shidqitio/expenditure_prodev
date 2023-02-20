const express = require("express");
const router = express.Router();
const { cekRKA,ganttchartmergernew,ganttcharTriwulan,biayaterpakaiunitperbulan } = require("../controllers/for_ebudgeting");


router.get("/cek-rka/:kode_rka", cekRKA);
router.get("/ganttchartmergernew", ganttchartmergernew);
router.get("/ganttchartriwulan/:kode_unit/:kode_trx_rkatu", ganttcharTriwulan);
router.get("/biaya-terpakai-unit-perbulan/:kode_unit/:kode_periode", biayaterpakaiunitperbulan);
module.exports = router;
