const express = require("express");
const router = express.Router();
const path = require("path");
const { getCharteBudgetingbyRKA,getforchart,
    ganttchart,ganttchartmerger,ganttchartmergernew,ujicoba,postpdf,kirimkepanutan } = require("../controllers/external");


//router.get("/e_budgeting/chart/:id", getCharteBudgetingbyRKA);
router.get("/e_budgeting/chart/", getforchart);
router.get("/expenditure/e_budgeting/ganttchart/", ganttchart);
router.get("/expenditure/e_budgeting/ganttchartmerger/", ganttchartmerger);
router.get("/expenditure/e_budgeting/ganttchartmergernew/", ganttchartmergernew);
router.post("/ujicoba",ujicoba);
router.post("/postpdf",postpdf);
router.get("/getNomor",kirimkepanutan);
module.exports = router;
