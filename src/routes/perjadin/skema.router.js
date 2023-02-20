const express = require("express");
const router = express.Router();
const skema = require("../../controllers/perjalanan_dinas/skema/pilih.skema");
const filterSkema = require("../../controllers/perjalanan_dinas/skema/filter.skema")
const terapkanBiaya = require("../../controllers/perjalanan_dinas/skema/terapkan.biaya");

router.get("/pilih-skema", skema.pilihSkema);
router.post("/terapkan-biaya", terapkanBiaya);
router.get("/filter-skema/:skema/:kode_tugas", filterSkema);
router.get("/filter/uang-harian/kode_katagori/:kode_trx_katagori", skema.filterUang);
router.get("/filter/penginapan/kode_katagori-kode_filter_terkait/:kode_trx_katagori/:kode_trx_filter_terkait",skema.filterPenginapan);

module.exports = router;