const express = require("express");
const router = express.Router();
const { getAll,pilihskema,getByid,nestedbaru,updatekomponen,updatetransport,updateSkemaDetailPerjalanan,pilihSkemanew,
    updatetransportnew,editKomponen,listKomponen,tambahKomponen,hapusKomponen } = require("../controllers/ref_skema_perjadin");
const skemaPerjadinScema = require("../request/ref_skema_perjadin")
const {verifyToken,pengusulToken} = require("../middleware/auth")
const { validationResult } = require("express-validator");
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");

router.get("/",getAll);
router.get("/byid/:id", getByid);
router.get("/nested/:id", nestedbaru);
router.post("/pilihskema",skemaPerjadinScema.pilihskema,pilihskema);
router.post("/pilih-skema-new",skemaPerjadinScema.pilihskemanew,validate.process,pilihSkemanew);
router.put("/updatekomponen",updatekomponen);
router.put("/updatetransport",skemaPerjadinScema.transport,validate.process,updatetransport);
router.put("/update-transport-new",skemaPerjadinScema.transportnew,validate.process,updatetransportnew);
router.put("/update-skema-perjalanan",skemaPerjadinScema.updateSkemaPerorang,validate.process,updateSkemaDetailPerjalanan)
router.put("/update-komponen/:kode_trx", editKomponen);
router.get("/list-komponen", listKomponen);
router.post("/tambah-komponen",tambahKomponen)
router.delete("/hapus-komponen:kode_trx",hapusKomponen)

module.exports = router;
