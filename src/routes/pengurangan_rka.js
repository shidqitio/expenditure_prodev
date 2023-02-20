const express = require("express");
const router = express.Router();
const {penguranganrka} = require("../controllers/ref_surat_tugas_rka_perjadin");
const rkaperjadinSchema = require("../request/validasi_pengurangan_rka");
const validate = require("../utils/validation");

router.post("/pengurangan",rkaperjadinSchema.penguranganrkaperjadin,validate.process,penguranganrka);

module.exports = router;