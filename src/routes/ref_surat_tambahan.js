const express = require("express");
const router = express.Router();
const uploadfile = require("../utils/uploadfile")
const validation = require("../utils/validation")
const Controller = require("../controllers/tambahan/ref_surat_tambahan")
const scema = require("../request/ref_surat_tambahan");

router.post(
  "/create-remun",
  uploadfile.upload.single("filetambahan"),
  validation.processFile,
  scema.create,
  validation.process,
  Controller.create
);

router.put("/update-remun/:kode_trx",scema.update,validation.process,Controller.update)

router.put("/update-rka-remun/:kode_trx",scema.updaterka,validation.process, Controller.updateRKA);

router.put(
  "/update-file-remun/:kode_trx",
  uploadfile.upload.single("filetambahan"),
  validation.processFile,
  Controller.updateFile
);

router.put("/update-status-remun/:kode_trx",scema.updatestatus,validation.process,Controller.updatestatus)

router.get("/by-status/:kode_status/:katagori",Controller.index2)

router.get("/by-id/:kode_trx", Controller.byid);

router.get("/list-spm/:tahun/:katagori", Controller.listSPM);


module.exports = router;