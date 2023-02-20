const express = require("express");
const router = express.Router();
const { getSuratHonorarium,getDetailSuratHonorarium, getDetailPetugasHonorarium,
    SuratTugasPerjadinDummy,SuratTugasPerjadinShowDummy } = require("../controllers/api_dummy");


router.get("/Honorarium/list-surat/:id_sub_unit", getSuratHonorarium);
router.get("/Honorarium/detail-surat/:id_surat", getDetailSuratHonorarium);
router.get("/Honorarium/detail-petugas/:id_surat", getDetailPetugasHonorarium);
router.get("/nadinetest/public/api/external/get_surtug_perjadin/:id_sub_unit",SuratTugasPerjadinDummy);
router.get("/nadinetest/public/api/external/get_detail_perjadin/:id_surat",SuratTugasPerjadinShowDummy)
module.exports = router;
