const express = require("express");
const router = express.Router();
const { jsonFormat } = require("../utils/jsonFormat");
const validate = require("../utils/validation");
const { validationResult } = require("express-validator");
const { 
    GetTokenAuth,CekAkun,TransferInternal,CekStatusTransfer,
    ShowOtherBank,CekAkunOther,TransferOther, 
    CreateVA, ShowReportTime,ShowBriva,DeleteVA,UpdateVA,UpdateStatusVA,ShowStatusVA,ShowReportHour,
    ShowMutasi,ujicoba,transferExpenditure
} = require("../controllers/BRIAPI");

const BRISchema = require("../request/BRIAPI");

router.get("/ujicoba", ujicoba);

router.post("/Token-Auth", GetTokenAuth);

router.post("/Transfer-expenditure", transferExpenditure);

//Transfer Sesama BRI

router.get("/Cek-Akun/:sourceaccount/:beneficiaryaccount", CekAkun);
router.post("/Transfer-Internal",BRISchema.Transfer_Internal,
validate.process, TransferInternal);
router.get("/Cek-Status/:noReferral", CekStatusTransfer);

//Other BANK

router.get("/Cek-Akun-Other-Bank/:bankcode/:beneficiaryaccount", CekAkunOther);
router.get("/List-BANK", ShowOtherBank);
router.post("/Transfer-Other",BRISchema.Transfer_Other,
validate.process,TransferOther);

//BRIVA 

router.post("/Briva",BRISchema.Briva_Create,
validate.process,CreateVA);
router.get("/Briva/:institutionCode/:brivaNo/:custCode",ShowBriva);
router.get("/Briva-Report-Date/:institutionCode/:brivaNo/:startDate/:EndDate",ShowReportTime);
router.delete("/Briva",BRISchema.Briva_Delete,
async (req,res,next) => {const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.statusCode = 401
      return jsonFormat(res, "failed", "validation failed", errors);
    }else{
      next()
    }
  },DeleteVA);
router.put("/Briva",BRISchema.Briva_Update,
  async (req,res,next) => {const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.statusCode = 401
        return jsonFormat(res, "failed", "validation failed", errors);
      }else{
        next()
      }
    },UpdateVA);
router.put("/Briva-Status",BRISchema.Briva_Update_Status,
validate.process,UpdateStatusVA);
router.get("/Briva-Status/:institutionCode/:brivaNo/:custCode",ShowStatusVA);
router.get("/Briva-Report-hour/:institutionCode/:brivaNo/:startDate/:startHour/:EndDate/:EndHour",ShowReportHour);

//Info Mutasi
router.post("/Info-Mutasi",BRISchema.Info_Mutasi,
validate.process,ShowMutasi);

module.exports = router;
