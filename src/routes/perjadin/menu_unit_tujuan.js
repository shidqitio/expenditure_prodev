const express = require("express");
const router = express.Router();
const validation = require("../../utils/validation")
const dataController = require("../../controllers/perjadin/menu_unit_tujuan");
const hadirController = require("../../controllers/perjadin/kehadiran_petugas_perjadin");
//const dataValidation = require("../../request/ref/ref_pajak_honorarium")

router.get("/index/:kode_unit_tujuan", dataController.listtamu);
router.get("/show/id-nip-tujuan-tahun/:id_surat_tugas/:nip/:kode_kota_tujuan/:tahun",dataController.show);
router.post("/store/kehadiran-petugas-perjadin",hadirController.store)
router.post("/store-bulk/kehadiran-petugas-perjadin",hadirController.bulkStore)

module.exports = router;