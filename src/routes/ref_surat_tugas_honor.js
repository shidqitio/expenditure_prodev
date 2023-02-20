const express = require("express");
const router = express.Router();
const {
  getAll,
  getByRka,
  getByUnit,
  create,
  update,
  deleteData,
  getByIdSurat,
  nested,getAllwithPanutan,insertPanutan
  
} = require("../controllers/ref_surat_tugas_honor");
const honorSchema = require("../request/ref_surat_honor");
const { validationResult } = require("express-validator");
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");

router.get("/", getAll);
router.get("/byid/:id", getByIdSurat);
router.get("/nested/:id", nested);
router.get("/rka/:id", getByRka);
router.get("/unit/:id", getByUnit);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleteData);
router.get("/withpanutan/:id", getAllwithPanutan);
router.post("/input-panutan",honorSchema.inputPanutan,validate.process,insertPanutan);

module.exports = router;
