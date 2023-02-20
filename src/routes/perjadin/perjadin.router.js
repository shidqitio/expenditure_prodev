const express = require("express");
const router = express.Router();

// Validation errors
const validation = require("../../utils/validation")

// Schema validation errors
const schema = require("../../request/perjadin/perjadin.assignement.schema")
const {perjadinFind, perjadinList, perjadinCreate, perjadinUpdate, perjadinDraft, perjadinAssignments,perjadinFindNest} = require("../../controllers/perjalanan_dinas/perjadin");

router.get("/transaction-perjadin", perjadinList);
router.get("/transaction-perjadin/type-of-trip/:type_of_trip", perjadinList);
router.get("/transaction-perjadin/:id_surat", perjadinFind);
router.get("/transaction-perjadin-nest/:id", perjadinFindNest);
router.post("/transaction-perjadin", validation.process, perjadinCreate);
router.post("/transaction-perjadin/assignments", schema.perjadinAssignmentSchema, validation.process, perjadinAssignments);
router.post("/transaction-perjadin/draft", perjadinDraft);
router.put("/transaction-perjadin", validation.process, perjadinUpdate);

module.exports = router;