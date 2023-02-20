const express = require("express");
const router = express.Router();
const { getAll,
    filtersatu,
    filterdua,
    pokjargetbykodekabko,
    kabkogetbykodeprovinsi,
    provinsigetbykodenegara,
    createsbmpanutan,
    createprovinsipanutan,
    createkabkopanutan,
    createpokjarpanutan,
    jenis_surat,
    filtergabungan
 } = require("../controllers/externalpanutan");
 const validate = require("../utils/validation");
    const exPanutanSchema = require("../request/external_panutan");


//router.get("/e_budgeting/chart/:id", getCharteBudgetingbyRKA);
router.get("/panutan/pokjar/getall", getAll);
router.get("/panutan/jenissurat/getall", jenis_surat);
router.get("/panutan/pokjar/:kode_unit", filtersatu);
router.get("/panutan/pokjar-gabungan/:kode_unit", filtergabungan);
router.get("/panutan/pokjar/:kode_unit/:asal", filterdua);
router.get("/panutan/pokjar-master/pokjargetbykodekabko/:kode_kabko",pokjargetbykodekabko);
router.get("/panutan/kabko/kabkogetbykodeprovinsi/:kode_provinsi",kabkogetbykodeprovinsi);
router.get("/panutan/provinsi/provinsigetbykodenegara/:kode_negara",provinsigetbykodenegara);
router.post("/panutan/sbm-transport/createsbmpanutan",exPanutanSchema.createsbmpanutan,validate.process,createsbmpanutan);
router.post("/panutan/provinsi/createprovinsipanutan",exPanutanSchema.createprovinsipanutan,validate.process,createprovinsipanutan);
router.post("/panutan/kabko/createkabkopanutan",exPanutanSchema.createkabkopanutan,validate.process,createkabkopanutan);
router.post("/panutan/pokjar/createpokjarpanutan",exPanutanSchema.createpokjarpanutan,validate.process,createpokjarpanutan);

module.exports = router;
