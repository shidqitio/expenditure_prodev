const express = require("express");
const router = express.Router();
const {
  getAll,
  getAllUnit,
  getAllKeuangan,
  panutanExcludeExpenditure,
  toTransport,
  getByRka,
  getByUnit,
  create,
  update,
  deleteData,
  getByIdSurat,
  getAllwithPanutan,
  getlistPanutan,
  nestedbaru,
  updatestatus,
  nestednew,
  createNew,
  getByUnitStatus
} = require("../controllers/ref_surat_tugas_perjadin");
const suratTugasSchema = require("../request/ref_surat_tugas_perjadin");
const { validationResult } = require("express-validator");
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");

router.get("/trans/:id", toTransport);
router.get("/", getAll);
router.get("/Unit", getAllUnit);
router.get("/Keuangan",getAllKeuangan);
router.get("/withpanutan/:id", getAllwithPanutan);
router.get("/panutan/:id", getlistPanutan);
router.get("/panutan-exclude-expenditure/:id/:tahun", panutanExcludeExpenditure);
router.get("/byid/:id", getByIdSurat);
router.get("/rka/:id", getByRka);
router.get("/unit/:id", getByUnit);
router.get("/unit-status/:id/:status", getByUnitStatus);
router.post("/", suratTugasSchema.create,validate.process, create);
router.post("/insert-rka", suratTugasSchema.inputRKA,validate.process, createNew);
router.put("/:id", update);
router.delete("/:id", deleteData);
router.get("/nested/:kode_unit/:id", nestedbaru);
router.get("/nested-new/:kode_unit/:id", nestednew);
router.put("/update-status/:id_surat_tugas/:kode_unit/:tahun",suratTugasSchema.updatestatus,validate.process,updatestatus);

module.exports = router;
