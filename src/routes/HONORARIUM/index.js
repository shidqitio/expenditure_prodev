const express = require("express");
const router = express.Router();
const {
  insertPetugasTHL,
} = require("../../controllers/honorarium/honorarium_petugas");
const HONORARIUMUPDATE = require("../../controllers/honorarium/honorarium_update");
const requestValidation = require("../../request/HONORARIUM");
const validation = require("../../utils/validation");

router.post(
  "/INSERT/PETUGAS-THL",
  requestValidation.insertPetugasTHL,
  validation.process,
  insertPetugasTHL
);

router.post(
  "/UPDATE/SURAT-HONOR-PANUTAN",
  requestValidation.updateSuratPanutan,
  validation.process,
  HONORARIUMUPDATE.StatusPanutan
);

module.exports = router;
