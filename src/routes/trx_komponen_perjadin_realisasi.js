const express = require("express");
const { jsonFormat } = require("../utils/jsonFormat");
const router = express.Router();
const {getByKode, create,getAll,multifile} = require("../controllers/trx_komponen_perjadin_realisasi");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// CONFIGURATION UPLOAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/public/perjadin/");
    },
    filename: (req, file, cb) => {
      const nama_image ="expereal_"+Date.now() + path.parse(file.originalname).ext;
      cb(null, nama_image);
    },
  });

  const multerfilter = (res,file,next) =>{
    const arrJenisFile = ["pdf","jpeg","png","jpg"]
    if(arrJenisFile.includes(file.mimetype.split('/')[1])){
      next(null,true)
    }else{
      next(null,false)
    }
  }

  const upload = multer({
    storage:storage,
    fileFilter:multerfilter
  })

  router.post("/upload-file",upload.single('filekomponenperjadin'),create)
   router.post("/multi-file",upload.single('filekomponenperjadin'),multifile)

  

router.get("/getbykode",getAll);
router.post("/create",create);
module.exports = router;