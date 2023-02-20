const express = require("express");
const router = express.Router();
const {
  getByIdSurat,update
} = require("../controllers/trx_komponen_perjadin");

router.get("/byid/:id_surat", getByIdSurat);
router.put("/update/:id", update);


module.exports = router;
