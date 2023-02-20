const KomponenPerjadinRealisasi = require("../models/trx_komponen_perjadin_realisasi");
const path = require("path");
const fs = require("fs");
const { count } = require("console");

exports.index = (req, res, next) => {
  Komponen.findAll()
    .then((app) => {
      res.json({
        status: "success",
        message: "Berhasil menampilkan data",
        data: app,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.store = (req, res, next) => {
  const filename = path.parse(req.file.filename).base;
  Komponen.max("kode_Komponen")
    .then((kode_app) => {
      let kode_Komponen = "00";

      if (kode_app !== null) {
        kode_Komponen = kode_app;
      }

      let kode1 = parseInt(kode_Komponen.charAt(0));
      let kode2 = parseInt(kode_Komponen.charAt(1));

      if (kode1 > 0) {
        if (kode2 === 9) {
          kode1 = parseInt(kode1) + 1;
          kode2 = 0;
          kode_Komponen = kode1.toString() + kode2.toString();
        } else {
          kode_Komponen = parseInt(kode_Komponen) + 1;
        }
      }

      if (kode1 === 0) {
        if (kode2 === 9) {
          kode1 = parseInt(kode1) + 1;
          kode2 = 0;
          kode_Komponen = kode1.toString() + kode2.toString();
        } else {
          kode_Komponen = kode1.toString() + String(parseInt(kode2) + 1);
        }
      }

      if (kode_app === null) {
        kode_Komponen = "00";
      }

      return Komponen.create({
        kode_Komponen: kode_Komponen,
        nama_Komponen: req.body.nama_Komponen,
        keterangan: req.body.keterangan,
        status: "1",
        image: filename,
        url: req.body.url,
        ucr: req.user.name,
      });
    })
    .then((app) => {
      res.json({
        status: "success",
        message: "Berhasil menyimpan data",
        data: app,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.show = (req, res, next) => {
  Komponen.findOne({ where: { kode_Komponen: req.params.id } })
    .then((app) => {
      if (!app) {
        throw new Error("Kode Komponen tidak ada");
      }
      res.json({
        status: "success",
        message: "Berhasil menampilkan data",
        data: app,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  let data = {
    nama_Komponen: req.body.nama_Komponen,
    keterangan: req.body.keterangan,
    status: req.body.status,
    url: req.body.url,
    uch: req.user.name,
  };

  if (req.file) {
    const filename = path.parse(req.file.filename).base;
    data = {
      nama_Komponen: req.body.nama_Komponen,
      keterangan: req.body.keterangan,
      status: req.body.status,
      image: filename,
      url: req.body.url,
      uch: req.user.name,
    };
  }

  Komponen.findOne({ where: { kode_Komponen: req.params.id } })
    .then((app) => {
      if (req.file) {
        clearImage(app.image);
      }
      if (!app) {
        throw new Error("Kode Komponen tidak ada");
      }
      return Komponen.update(data, { where: { kode_Komponen: req.params.id } });
    })
    .then((response) => {
      res.json({
        status: "success",
        message: "Berhasil memperbarui data",
        data: response,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.destroy = (req, res, next) => {
  Komponen.findOne({ where: { kode_Komponen: req.params.id } })
    .then((app) => {
      if (!app) {
        throw new Error("Kode Komponen tidak ada");
      }
      clearImage(app.image);
      return Komponen.destroy({
        where: {
          kode_Komponen: req.params.id,
        },
      });
    })
    .then((response) => {
      res.json({
        status: "success",
        message: "Berhasil menghapus data",
        data: response,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", "public", "image", filePath);
  fs.unlink(filePath, (err) => {
    console.log("unlink error", err);
  });
};
