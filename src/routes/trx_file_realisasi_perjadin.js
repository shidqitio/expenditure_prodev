const express = require("express");
const { jsonFormat } = require("../utils/jsonFormat");
const router = express.Router();
const {getAll,cobattd,multifile,remove,tandatanganbarcode,tandatanganManual} = require("../controllers/trx_file_realisasi_perjadin");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const fileSchema = require("../request/trx_file_realisasi_perjadin");
const validate = require("../utils/validation");

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

  const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/public/tandatanganmanual/");
    },
    filename: (req, file, cb) => {
      const nama_image ="expereal_"+Date.now() + path.parse(file.originalname).ext;
      cb(null, nama_image);
    },
  });

  const multerfilter2 = (res,file,next) =>{
    const arrJenisFile = ["pdf","jpeg","png","jpg"]
    let errr = 0
    for(let a = 0; a<file.length;a++){
    if(!arrJenisFile.includes(files[a].mimetype.split('/')[1])){
      errr++
    }
  }
  if(errr > 0){
    next(null,false)
  }else{
    next(null,true)
  }
  }

  const upload = multer({
    storage:storage,
    fileFilter:multerfilter
  })

  const upload2 = multer({
    storage:storage2,
    fileFilter:multerfilter
  })

router.post("/multi-file",upload.single('filekomponenperjadin'),fileSchema.create,validate.process,multifile)

router.get("/",getAll);
router.delete("/:id_trx/:link_file",remove);
router.get("/ttd",cobattd);
router.post("/tandatangan-barcode",tandatanganbarcode)
router.post("/tandatangan-manual",upload2.fields([{name:'file_link_ttd',maxCount:1},{name:'file_link_foto',maxCount:1}]),tandatanganManual)

module.exports = router;