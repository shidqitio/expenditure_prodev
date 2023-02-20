const express = require("express");
const router = express.Router();
const {
  getAll,
  create,
  update,
} = require("../controllers/trx_petugas_perjadin");

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

module.exports = router;
