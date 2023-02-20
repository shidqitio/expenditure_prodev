const express = require("express");
const router = express.Router();
const {
  getAll,
  getbyprimarykey,
  getbykodeunit,
  create,
  update,
  deleteData,
  filtersatu,
  filterdua,
  filterTransport,
  createPengajuanUnit,
  getbyketerangan,
  updateUnit,
  createmulti,
} = require("../controllers/ref_sbm_transport");
const sbmTransportSchema = require("../request/ref_sbm_transport");
const validate = require("../utils/validation");

// router.get("/", getAllRka);
router.get("/getAll", getAll);
router.get("/getbyprimarykey/kode_unit-asal-tujuan/:kode_unit/:asal/:tujuan", getbyprimarykey);
router.get("/filter-transport/kode_unit-asal-tujuan/:kode_unit/:asal/:tujuan", filterTransport);
router.get("/getbyketerangan/:keterangan", getbyketerangan);
router.get("/getbykodeunit/kode_unit/:kode_unit",getbykodeunit)
router.post("/", sbmTransportSchema.create,validate.process, create);
router.post("/pengajuan-unit", sbmTransportSchema.create,validate.process, createPengajuanUnit);
router.put(
  "/getbyprimarykey/kode_unit-asal-tujuan/:kode_unit/:asal/:tujuan",
  sbmTransportSchema.update,
  validate.process,
  update
);
router.put(
  "/update-unit/kode_unit-asal-tujuan/:kode_unit/:asal/:tujuan",
  sbmTransportSchema.update,
  validate.process,
  updateUnit
);
router.delete("/getbyprimarykey/kode_unit-asal-tujuan/:kode_unit/:asal/:tujuan", deleteData);
router.post(
  "/create-multi",
  sbmTransportSchema.create_multi,
  validate.process,
  createmulti
);
module.exports = router;
