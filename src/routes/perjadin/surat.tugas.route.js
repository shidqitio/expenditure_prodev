const express = require("express");
const router = express.Router();
const {
  getSuratTugas,
  getSuratTugasById,
  createSuratTugas,
  parafSurat,
  updateSurat,
  deleteSurat
} = require("../../controllers/perjalanan_dinas/surat/surat.tugas.perjadin");
const {suratTugasSchema} = require("../../request/surat_tugas/surat_tugas.schema");
const {validate} = require("../../middleware/validate")
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // custom folder
    const {ucr} = req.body;
    const folderPath = `./src/public/surattugas/${ucr}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    const fileName = `lampiran-${req.body.ucr}${ext}`;
    callback(null, fileName);
   
  },
});

const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).fields([{ name: "file" }]);

router.get("/", getSuratTugas);

router.post(
  "/create",
  uploadFile,
  suratTugasSchema,
  validate,
  createSuratTugas
);

router.post("/detail", getSuratTugasById);

router.post("/paraf", parafSurat);

router.post("/batal", deleteSurat);

module.exports = router;
