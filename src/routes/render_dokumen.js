const express = require("express");
const router = express.Router();
const Controller = require("../controllers/render_dokumen")
const Schema = require("../request/render_dokumen")
const validation = require("../utils/validation")

router.post("/one",Schema.renderkirimpanutan,validation.process,Controller.renderkirimpanutan)
router.post(
  "/multi",
  Schema.multirenderkirimpanutan,
  validation.process,
  Controller.multirenderkirimpanutan
);

router.post(
  "/getnomor/one",
  Schema.getnomor,
  validation.process,
  Controller.getnomor
);
router.post(
  "/getnomor/multi",
  Schema.getnomormulti,
  validation.process,
  Controller.multigetnomor
);

router.post(
  "/getnomor-langsung/one",
  Schema.getnomor,
  validation.process,
  Controller.getnomorlangsung
);
module.exports = router;
