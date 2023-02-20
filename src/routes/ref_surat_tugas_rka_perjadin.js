const express = require("express");
const router = express.Router();
const {penguranganrka} = require("../controllers/ref_surat_tugas_rka_perjadin");
const rkaperjadinSchema = require("../request/ref_surat_tugas_rka_perjadin");
const validate = require("../utils/validation");

router.post("/pengurangan",rkaPerjadinSchema.penguranganrka,validate.process,penguranganrka);
router.post("/pengurangan",rkaPerjadinSchema.penguranganrka,validate.process,penguranganrka);

module.exports = router;