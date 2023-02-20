const express = require("express");
const router = express.Router();
const { getUnit, getSuratTugasByUnit,getSuratTugasById, getPetugasByNomorSurat,getUnitbyId,getUnitbykodeunit } = require("../controllers/panutan");

router.get("/unit", getUnit);
router.get("/unit/id-unit/:id", getUnitbyId);
router.get("/unit/kode-unit/:id", getUnitbykodeunit);
router.get("/surat-tugas/unit/:id", getSuratTugasByUnit);
router.get("/surat-tugas/get-petugas/:id", getPetugasByNomorSurat);
router.get("/surat-tugas/get-surat/:id",getSuratTugasById);

module.exports = router;
