const {jsonFormat} = require("../utils/jsonFormat")
exports.multirenderkirimpanutan = (req, res, next) => {
  try {
    let dokumen = req.body.dokumen;
    for (let i = 0; i < dokumen.length; i++) {
      renderpdf.renderkirim(
        dokumen[i].scriptHtml,
        dokumen[i].sifat_surat,
        dokumen[i].id_trx,
        dokumen[i].nomor_surat,
        dokumen[i].perihal,
        dokumen[i].tanggal_surat,
        dokumen[i].nip_pembuat,
        dokumen[i].nip_penandatangan,
        dokumen[i].tahun
      );
    }
    jsonFormat(res, "success", "Berhasil, data sedang diproses render", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};

exports.renderkirimpanutan = (req, res, next) => {
  try {
    renderpdf.renderkirim(
      req.body.scriptHtml,
      req.body.sifat_surat,
      req.body.id_trx,
      req.body.nomor_surat,
      req.body.perihal,
      req.body.tanggal_surat,
      req.body.nip_pembuat,
      req.body.nip_penandatangan,
      req.body.tahun
    );
    jsonFormat(res, "success", "Berhasil, data sedang diproses render", []);
  } catch (err) {
    jsonFormat(res, "failed", err.message, []);
  }
};
