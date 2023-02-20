const express = require("express");
const router = express.Router();
const { getByAkun } = require("../controllers/ref_rka_dummy");

// router.get("/", getAllRka);
router.get("/byakun/:akun", getByAkun);

module.exports = router;
