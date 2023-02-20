
const multer = require("multer");
const path = require("path");
// CONFIGURATION UPLOAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/public/storeone/");
    },
    filename: (req, file, cb) => {
      const nama_image ="expereal_"+Date.now() + path.parse(file.originalname).ext;
      cb(null, nama_image);
    },
  });

  const multerfilter = (res,file,next) =>{
    const arrJenisFile = ["pdf", "jpeg", "png", "jpg", "xlsx"];
    console.log(file.mimetype);
    if(arrJenisFile.includes(file.mimetype.split('/')[1])){
      next(null,true)
    }else{
      next(null,false)

    }
  }

  const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/public/multi/");
    },
    filename: (req, file, cb) => {
      const nama_image ="expereal_"+Date.now() + path.parse(file.originalname).ext;
      cb(null, nama_image);
    },
  });

  const multerfilter2 = (res,file,next) =>{
    const arrJenisFile = ["pdf", "jpeg", "png", "jpg", "xlsx"];
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

  exports.upload = multer({
    storage:storage,
    fileFilter:multerfilter
  })

  exports.upload2 = multer({
    storage:storage2,
    fileFilter:multerfilter2
  })