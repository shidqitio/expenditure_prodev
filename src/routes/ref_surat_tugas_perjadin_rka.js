const express = require("express");
const router = express.Router();
const {penguranganrka,renderdankirim} = require("../controllers/ref_surat_tugas_rka_perjadin");
const rkaperjadinSchema = require("../request/ref_rka_perjadin");
const validate = require("../utils/validation");

router.post("/pengurangan",rkaperjadinSchema.penguranganrka,validate.process,penguranganrka);
router.post("/pengajuan",rkaperjadinSchema.kirimdanrender,validate.process,renderdankirim );


module.exports = router;