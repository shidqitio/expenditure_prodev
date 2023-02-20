const express = require("express");
const router = express.Router();
const DataController = require("../controllers/honorarium/ref_honorarium_kegiatan");
const DataSPMController = require("../controllers/honorarium/ref_spm_honorarium");
const DokumenController = require("../controllers/honorarium/render_honorarium");
const validation = require("../utils/validation")
const dataInsertController = require("../controllers/honorarium/insert_ref_petugas_honorarium")
const dataValidation = require("../request/ref_honorarium_kegiatan")
const {authenticate} = require("../middleware/auth");

router.get("/panutan-belum-diproses/:id_sub_unit/:jenis_honor/:nama",authenticate,dataValidation.BelumDiproses,validation.process, DataController.BelumDiproses)
router.get("/expenditure/:id_sub_unit/:jenis_honor/:nama/:kode_status",authenticate, DataController.getHonorByheader)
router.get(
  "/expenditure-noauth/:id_sub_unit/:jenis_honor/:nama/:kode_status",
  
  DataController.getHonorByheader
);
router.get("/noauth", DataController.getHonor);
router.get("/index",authenticate, DataController.getHonor);
router.get("/show/:kode_surat/:tahun",authenticate,dataValidation.show,validation.process, DataController.getHonorById)
router.get(
  "/show-noauth/:kode_surat/:tahun",
  dataValidation.show,
  validation.process,
  DataController.getHonorById
);
router.get("/show-petugas/:kode_trx",authenticate,dataValidation.showPetugas,validation.process,DataController.ShowPetugas)

router.get("/get-sk-panutan/:kode_surat/:nama_honor/:tahun",DataController.getHonorPanutan)
router.get("/spm-honorarium/:tahun/:jenis_honor/:nama_honor",authenticate,DataSPMController.listSPMHonor)
router.get("/spm-honorarium/:tahun/:jenis_honor/:nama_honor",authenticate,DataSPMController.listSPMHonor)
router.get(
  "/spm-honorarium-noauth/:tahun/:jenis_honor/:nama_honor",
  DataSPMController.listSPMHonor
);
router.get(
  "/spm-honorarium/:tahun/:jenis_honor/:nama_honor/:kode_unit",
  authenticate,
  DataSPMController.listSPMHonorByUnit
);

router.get(
  "/spm-honorarium-by-unit-tahun/:tahun/:id_sub_unit",
  authenticate,
  DataSPMController.listSPMHonorByUnitTahun
);

router.get(
  "/spm-honorarium-by-unit-tahun-noauth/:tahun/:id_sub_unit",
  DataSPMController.listSPMHonorByUnitTahun
);

router.get(
  "/spm-honorarium-by-unit-tahun-noauth/:tahun/:kode_unit",

  DataSPMController.listSPMHonorByUnitTahun
);

router.get(
  "/spm-honorarium-noauth/:tahun/:jenis_honor/:nama_honor/:kode_unit",
  DataSPMController.listSPMHonorByUnit
);
router.get(
  "/list-buat-panutan/:id_sub_unit/:nama_honor",
  DataController.getlistByheaderPanutan
);


//POST
router.post("/store",dataValidation.store,validation.process,DataController.storeHonor);
router.post("/store-petugas",dataValidation.storePetugas,validation.process,DataController.storePetugas)

//Get NOMOR dan render
router.post("/get-nomor",authenticate,dataValidation.getnomor,validation.process,DokumenController.getNomor)
router.post("/render-dokumen",authenticate,dataValidation.renderKirim,validation.process,DokumenController.renderKirim)
router.post("/get-nomor-spm",authenticate,dataValidation.getnomorSPM,validation.process,DokumenController.getNomorSPM)
router.post("/render-dokumen-spm",authenticate,dataValidation.renderKirimSPM,validation.process,DokumenController.renderKirimSPM)
router.post("/render-dokumen-spm-ra",dataValidation.renderKirimSPM,validation.process,DokumenController.renderKirimSPM)

//router.post("/store-panitia-kegiatan",dataValidation.storeHonorPanitiaPanutan,validation.process,DataController.storeHonorPanitiaPanutan)
router.post("/store-panitia-kegiatan",dataValidation.storeHonorPanitiaPanutan,validation.process,dataInsertController.insertPanitiaKegiatan)
router.post("/store-sk",dataValidation.storeSKpanutan,validation.process,DataController.storeHonorPanutan)
//router.post("/store-pengisi-kegiatan",dataValidation.storeHonorPengisiPanutan,validation.process,DataController.storeHonorPengisiPanutan)
router.post("/store-penulis-soal",dataValidation.storeHonorPenulisSoal,validation.process,DataController.storeHonorPenulisSoal)
router.post("/store-pengisi-kegiatan",dataValidation.storeHonorPengisiPanutannew,validation.process,dataInsertController.insertPengisiKegiatan)
router.post("/store-petugas-honorarium",dataValidation.storeHonorariumPetugasPanutan,validation.process,dataInsertController.insertPetugasHonor)

//EDIT
router.put("/update-sk/:kode_surat/:tahun",dataValidation.editSK,validation.process,DataController.editSK)
router.put("/update-status-sk/:id_surat_tugas/:tahun",dataValidation.UpdateSKStatus,validation.process,DataController.UpdateSKStatus)

//PUSH RKA
router.put("/update-rka-sk/:kode_surat/:tahun",dataValidation.InputRKA,validation.process,DataController.InputRKA)

router.put("/update-nominal-petugas-honorarium/:kode_trx",dataValidation.updateNominalPetugasHonor,validation.process,dataInsertController.updateNominalPetugasHonor)


module.exports = router;
