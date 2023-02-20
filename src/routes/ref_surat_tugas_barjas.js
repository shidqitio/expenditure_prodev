const express = require("express");
const router = express.Router();
const { nestedAll,allpanutanBarjas,detailbarjaspanutan,getdetailpembayaran,listSPM,
    nestedfrompanutan,nestedlistfrompanutan,nestedexpenditure,panutanexcludeexpenditure,
    detailBarjas,allexpenditure,
    transferdata,renderkrirmspm,
    store,storeOne,
    UpdateStatusBarjas
    ,getNomorSpm,NestedBarjas } = require("../controllers/ref_surat_tugas_barjas");
const barjasSchema = require("../request/ref_surat_barjas")
const { validationResult } = require("express-validator");
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");
const {authenticate} = require("../middleware/auth");

router.get("/allpanutan",authenticate, allpanutanBarjas);
router.get("/nested-all",authenticate, nestedAll);
router.get("/nested-detail/:id_permintaan/:id_kontrak",authenticate, detailBarjas);
router.get("/nested-detail-noauth/:id_permintaan/:id_kontrak", detailBarjas);
router.get("/allpanutannested",authenticate, nestedlistfrompanutan);
router.get("/detailbarjaspanutan/:id_permintaan",authenticate,detailbarjaspanutan);
router.get("/nestedfrompanutan/:id_permintaan",authenticate,nestedfrompanutan);
router.get("/detailpermintaanpanutan/:id_level/:id_permintaan",authenticate,getdetailpembayaran);
router.get("/allexpenditure",authenticate, allexpenditure);
router.get("/nested-expenditure/:kode_permintaan/:kode_kontrak",authenticate, nestedexpenditure);
router.get("/sibela-exclude-expenditure/:tahun",authenticate, panutanexcludeexpenditure);
router.get("/list-spm",authenticate, listSPM);
router.post("/get-nomor-spm",authenticate,barjasSchema.getNomor,validate.process, transferdata);
router.post("/render-spm",authenticate, renderkrirmspm);
router.post("/store",barjasSchema.store,validate.process, store);

router.post("/store-one",barjasSchema.storeOne,validate.process, storeOne);

router.post("/get-nomor-spm-new",authenticate,barjasSchema.getNomorSPM,validate.process, getNomorSpm);

router.put("/update-status",authenticate,barjasSchema.UpdateStatus,validate.process, UpdateStatusBarjas);

router.get("/nested-barjas/:kode_permintaan/:kode_kontrak/:tahun",authenticate, NestedBarjas);

module.exports = router;